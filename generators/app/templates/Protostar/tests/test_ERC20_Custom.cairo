%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.uint256 import Uint256

# testing vars
<%= testingVars %>

@contract_interface
namespace StorageContract:
    func name() -> (name : felt):
    end
    func symbol() -> (symbol : felt):
    end
    func decimals() -> (decimals : felt):
    end
    func totalSupply() -> (totalSupply : Uint256):
    end
    func balanceOf(account : felt) -> (balance : Uint256):
    end
    func allowance(owner : felt, spender : felt) -> (remaining : Uint256):
    end
    func transfer(recipient : felt, amount : Uint256) -> (success : felt):
    end
    func approve(spender : felt, amount : Uint256) -> (success : felt):
    end
end

func get_deployed_contract_address{
    syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*
}() -> (contract_address : felt):
    alloc_locals
    local contract_address : felt
    %{ ids.contract_address = deploy_contract("./src/ERC20.cairo", [<%= constructorCalldata %>]).contract_address %}
    return (contract_address)
end

@external
func test_name{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    let (contract_address) = get_deployed_contract_address()
    let (name) = StorageContract.name(contract_address)
    assert name = NAME
    return ()
end

@external
func test_symbol{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    let (contract_address) = get_deployed_contract_address()
    let (symbol) = StorageContract.symbol(contract_address)
    assert symbol = SYMBOL
    return ()
end

@external
func test_decimals{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    let (contract_address) = get_deployed_contract_address()
    let (decimals) = StorageContract.decimals(contract_address)
    assert decimals = DECIMALS
    return ()
end

@external
func test_totalSupply{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    let (contract_address) = get_deployed_contract_address()
    let (totalSupply) = StorageContract.totalSupply(contract_address)
    assert totalSupply.low = INIT_SUPPLY_LOW
    assert totalSupply.high = INIT_SUPPLY_HIGH
    return ()
end

<% if (hasOwner) { %>
@external
func test_initial_supply_belong_to_owner{
    syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*
}():
    let (contract_address) = get_deployed_contract_address()
    let (balance) = StorageContract.balanceOf(contract_address, OWNER)
    assert balance.low = INIT_SUPPLY_LOW
    assert balance.high = INIT_SUPPLY_HIGH
    return ()
end

@external
func test_initial_allowance_of_owner{
    syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*
}():
    let (contract_address) = get_deployed_contract_address()
    let (remaining) = StorageContract.allowance(contract_address, OWNER, SPENDER)
    assert remaining.low = 0
    assert remaining.high = 0
    return ()
end

@external
func test_approve{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    alloc_locals
    let (contract_address) = get_deployed_contract_address()
    %{ stop_prank_callable = start_prank(caller_address=ids.OWNER, target_contract_address=ids.contract_address) %}
    let (remaining) = StorageContract.allowance(contract_address, OWNER, SPENDER)
    assert remaining.low = 0
    assert remaining.high = 0
    let amount_to_approve = Uint256(10, 11)
    StorageContract.approve(contract_address, SPENDER, amount_to_approve)
    let (remaining1) = StorageContract.allowance(contract_address, OWNER, SPENDER)
    assert remaining1.low = 10
    assert remaining1.high = 11
    %{ stop_prank_callable() %}
    return ()
end

@external
func test_approve_error_zero_address_spender{
    syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*
}():
    let (contract_address) = get_deployed_contract_address()
    %{ stop_prank_callable = start_prank(caller_address=ids.OWNER, target_contract_address=ids.contract_address) %}
    let amount_to_approve = Uint256(10, 11)
    %{ expect_revert(error_message="ERC20: cannot approve to the zero address") %}
    let (remaining) = StorageContract.approve(contract_address, 0, amount_to_approve)
    %{ stop_prank_callable() %}
    return ()
end
<% } %>

@external
func test_approve_error_zero_address_owner{
    syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*
}():
    let (contract_address) = get_deployed_contract_address()
    %{ stop_prank_callable = start_prank(caller_address=0, target_contract_address=ids.contract_address) %}
    let amount_to_approve = Uint256(10, 11)
    %{ expect_revert(error_message="ERC20: zero address cannot approve") %}
    let (remaining) = StorageContract.approve(contract_address, 0, amount_to_approve)
    %{ stop_prank_callable() %}
    return ()
end

<% if (hasOwner) { %>
@external
func test_approve_event{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    let (contract_address) = get_deployed_contract_address()
    %{ stop_prank_callable = start_prank(caller_address=ids.OWNER, target_contract_address=ids.contract_address) %}
    let amount_to_approve = Uint256(10, 11)
    %{ expect_events({"name": "Approval", "data": [ids.OWNER, 12, 10, 11]}) %}
    let (remaining) = StorageContract.approve(contract_address, 12, amount_to_approve)
    %{ stop_prank_callable() %}
    return ()
end

<% if (erc20InitialSupplyLowBits >= 10) { %>
@external
func test_transfer{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    let (contract_address) = get_deployed_contract_address()
    %{ stop_prank_callable = start_prank(caller_address=ids.OWNER, target_contract_address=ids.contract_address) %}
    let amount_to_transfer = Uint256(10, 0)
    StorageContract.approve(contract_address, SPENDER, amount_to_transfer)
    StorageContract.transfer(contract_address, SPENDER, amount_to_transfer)
    let (balance) = StorageContract.balanceOf(contract_address, OWNER)
    assert balance.low = <%= erc20InitialSupplyLowBits %>-10
    assert balance.high = <%= erc20InitialSupplyHighBits %>
    let (balance) = StorageContract.balanceOf(contract_address, SPENDER)
    assert balance.low = 10
    assert balance.high = 0
    %{ stop_prank_callable() %}
    return ()
end
<% } %>
<% } %>