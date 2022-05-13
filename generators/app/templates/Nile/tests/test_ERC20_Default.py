"""erc20.cairo test file."""
import pytest
from starkware.starknet.testing.starknet import Starknet
from utils import (
    cached_contract, get_contract_def, to_uint, str_to_felt, assert_event_emitted, assert_revert
)

# testing vars
OWNER=42
SPENDER=9
NAME = str_to_felt("Starknet")
SYMBOL = str_to_felt("STARK")
INIT_SUPPLY = to_uint(1000)
DECIMALS = 18

# setup
@pytest.fixture
def contract_defs():
    erc20_def = get_contract_def('ERC20.cairo')
    return erc20_def

@pytest.fixture
async def erc20_init(contract_defs):
    erc20_def = contract_defs
    starknet = await Starknet.empty()
    erc20 = await starknet.deploy(
        contract_def=erc20_def,
        constructor_calldata=[NAME, SYMBOL, DECIMALS, *INIT_SUPPLY, OWNER]
    )
    return (
        starknet.state,
        erc20,
    )

@pytest.fixture
def erc20_factory(contract_defs, erc20_init):
    erc20_def = contract_defs
    state, erc20 = erc20_init
    _state = state.copy()
    erc20 = cached_contract(_state, erc20_def, erc20)    
    return erc20

# actual tests
@pytest.mark.asyncio
async def test_name(erc20_factory):
    execution_info = await erc20_factory.name().call()
    assert execution_info.result.name == NAME

@pytest.mark.asyncio
async def test_symbol(erc20_factory):
    execution_info = await erc20_factory.symbol().call()
    assert execution_info.result.symbol == SYMBOL

@pytest.mark.asyncio
async def test_decimals(erc20_factory):
    execution_info = await erc20_factory.decimals().call()
    assert execution_info.result.decimals == DECIMALS


@pytest.mark.asyncio
async def test_totalSupply(erc20_factory):
    execution_info = await erc20_factory.totalSupply().call()
    assert execution_info.result.totalSupply == INIT_SUPPLY

@pytest.mark.asyncio
async def test_initial_supply_belong_to_owner(erc20_factory):
    execution_info = await erc20_factory.balanceOf(account=OWNER).call()
    assert execution_info.result.balance == INIT_SUPPLY

@pytest.mark.asyncio
async def test_initial_allowance_of_owner(erc20_factory):
    execution_info = await erc20_factory.allowance(owner=OWNER, spender=SPENDER).call()
    assert execution_info.result.remaining == (0,0)

@pytest.mark.asyncio
async def test_approve(erc20_factory):
    execution_info = await erc20_factory.allowance(owner=OWNER, spender=SPENDER).call()
    assert execution_info.result.remaining == (0,0)
    execution_info = await erc20_factory.approve(spender=SPENDER, amount=(10,11)).invoke(caller_address=OWNER)
    assert execution_info.result.success == 1
    execution_info = await erc20_factory.allowance(owner=OWNER, spender=SPENDER).call()
    assert execution_info.result.remaining == (10,11)

@pytest.mark.asyncio
async def test_approve_error_zero_address_spender(erc20_factory):
    await assert_revert(erc20_factory.approve(spender=0, amount=(10,11)).invoke(), "ERC20: zero address cannot approve")

@pytest.mark.asyncio
async def test_approve_error_zero_address_owner(erc20_factory):
    await assert_revert(erc20_factory.approve(spender=SPENDER, amount=(10,11)).invoke(caller_address=0), "ERC20: zero address cannot approve")

@pytest.mark.asyncio
async def test_approve_event(erc20_factory):
    execution_info = await erc20_factory.approve(spender=SPENDER, amount=(10,11)).invoke(caller_address=OWNER)
    assert_event_emitted(execution_info, erc20_factory.contract_address, "Approval", [OWNER, SPENDER, 10,11])

@pytest.mark.asyncio
async def test_transfer(erc20_factory):
    execution_info = await erc20_factory.transfer(recipient=SPENDER, amount=(10,0)).invoke(caller_address=OWNER)
    await assert_balanceOf(erc20_factory, OWNER, (990,0))
    await assert_balanceOf(erc20_factory, SPENDER, (10,0))


async def assert_balanceOf(erc20_factory, account, balance):
    execution_info = await erc20_factory.balanceOf(account=account).call()
    assert execution_info.result.balance == balance