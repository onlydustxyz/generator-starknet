"""erc20.cairo test file."""
import inspect
import os
import pytest
import openzeppelin
from starkware.starknet.testing.starknet import Starknet
from starkware.starknet.compiler.compile import compile_starknet_files
from utils import (
    Signer, cached_contract, get_contract_def, to_uint, str_to_felt
)

signer = Signer(123456789987654321)

# testing vars
<%= testingVars %>

def get_oz_lib_def(path):
    """Returns the contract definition from libraries"""
    path = os.path.abspath(os.path.dirname(inspect.getfile(openzeppelin))) + "/" + path
    contract_def = compile_starknet_files(
        files=[path],
        debug_info=True
    )
    return contract_def

@pytest.fixture
def contract_defs():
    account_def = get_oz_lib_def('account/Account.cairo')
    erc20_def = get_contract_def('ERC20.cairo')
    proxy_def = get_oz_lib_def('upgrades/Proxy.cairo')
    return (
        account_def,
        erc20_def,
        proxy_def
    )

@pytest.fixture
async def erc20_init(contract_defs):
    account_def, erc20_def, proxy_def = contract_defs
    starknet = await Starknet.empty()
    account = await starknet.deploy(
        contract_def=account_def,
        constructor_calldata=[signer.public_key]
    )
    erc20 = await starknet.deploy(
        contract_def=erc20_def,
        constructor_calldata=[]
    )
    proxy = await starknet.deploy(
        contract_def=proxy_def,
        constructor_calldata=[erc20.contract_address]
    )
    return (
        starknet.state,
        account,
        erc20,
        proxy
    )

@pytest.fixture
def erc20_factory(contract_defs, erc20_init):
    account_def, erc20_def, proxy_def = contract_defs
    state, account, erc20, proxy = erc20_init
    _state = state.copy()
    account = cached_contract(_state, account_def, account)
    erc20 = cached_contract(_state, erc20_def, erc20)
    proxy = cached_contract(_state, proxy_def, proxy)

    return account, erc20, proxy

@pytest.mark.asyncio
async def test_initial_data(erc20_factory):
    admin, _, proxy = erc20_factory

    await signer.send_transaction(
        admin, proxy.contract_address, 'initializer', [
            <%= constructorCalldata %>
        ])
    
    # check name
    execution_info = await signer.send_transaction(
        admin, proxy.contract_address, 'name', [])
    assert execution_info.result.response == [NAME]