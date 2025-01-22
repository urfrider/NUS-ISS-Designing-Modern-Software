package com.nus_iss.spring.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class sum {

    @Test
    public void testAdd() {
        int a = 5;
        int b = 3;
        assertEquals(8, a + b, "5 + 3 should equal 5");
        System.out.println("TEST SUCCESS!");
    }

}
