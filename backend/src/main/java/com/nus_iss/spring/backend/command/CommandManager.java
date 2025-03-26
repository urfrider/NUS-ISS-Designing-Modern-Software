package com.nus_iss.spring.backend.command;

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import com.nus_iss.spring.backend.command.interfaces.Command;

import jakarta.transaction.Transactional;

@Service
public class CommandManager {
    
    private final Map<Long, Stack<Command>> userCommandStacks = new HashMap<>();
    private static final Logger logger = LoggerFactory.getLogger(CommandManager.class);

    @Transactional
    public void executeCommand(Long cartId, Command command){
        userCommandStacks.putIfAbsent(cartId, new Stack<>());
        Stack<Command> commandStack = userCommandStacks.get(cartId);

        command.execute();
        commandStack.push(command);
        logger.info("EXECUTE Commands in stack for cartId {}: {}", cartId, commandStack);
    }

    @Transactional
    public void undoCommand(Long cartId) {
        Stack<Command> commandStack = userCommandStacks.get(cartId);
        logger.info("UNDO Commands in stack for cartId {}: {}", cartId, commandStack);
        commandStack.forEach(command -> System.out.println(command.getClass().getSimpleName()));

        if (commandStack != null && !commandStack.empty()){
            Command command = commandStack.pop();
            command.undo();
        }
    }
}
