// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

contract ToDos {
    mapping(address => string[]) addressToTodos;

    function addTodo(string memory todo) public {
        string[] storage todos = addressToTodos[msg.sender];
        todos.push(todo);

        addressToTodos[msg.sender] = todos;
    }

    function getTodos() public view returns (string[] memory) {
        return addressToTodos[msg.sender];
    }

    function removeTodos(uint256 index) public {
        require(index < addressToTodos[msg.sender].length, "Index out of bounds");

        for (uint256 i = index; i < addressToTodos[msg.sender].length - 1; i++) {
            addressToTodos[msg.sender][i] = addressToTodos[msg.sender][i + 1];
        }

        // Remove the last element
        addressToTodos[msg.sender].pop();
    }
}
