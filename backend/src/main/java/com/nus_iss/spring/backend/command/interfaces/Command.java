package com.nus_iss.spring.backend.command.interfaces;

public interface Command {
    void execute();
    void undo();
}
