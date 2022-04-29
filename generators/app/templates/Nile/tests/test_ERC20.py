"""erc20.cairo test file."""
import pytest
from starkware.starknet.testing.starknet import Starknet
from utils import (
    assert_revert, cached_contract, contract_path, get_contract_def,
    to_uint, assert_event_emitted, str_to_felt, Signer
)


# testing vars
OWNER=42
NAME = str_to_felt("Starknet")
SYMBOL = str_to_felt("STARK")
INIT_SUPPLY = to_uint(1000)
DECIMALS = 18

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

@pytest.mark.asyncio
async def test_initial_data(erc20_factory):
    erc20 = erc20_factory
    execution_info = await erc20.name().call()
    assert execution_info.result.name == NAME