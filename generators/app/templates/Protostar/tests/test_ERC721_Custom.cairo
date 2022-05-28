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
end

func get_deployed_contract_address{
    syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*
}() -> (contract_address : felt):
    alloc_locals
    local contract_address : felt
    %{ ids.contract_address = deploy_contract("./src/ERC721.cairo", [<%= constructorCalldata %>]).contract_address %}
    return (contract_address)
end

@external
func test_initial_data{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    let (contract_address) = get_deployed_contract_address()
    let (name) = StorageContract.name(contract_address)
    assert name = NAME
    return ()
end
