package com.nus_iss.spring.backend.controllers;

import com.nus_iss.spring.backend.dtos.NotificationDto;
import com.nus_iss.spring.backend.services.NotificationServiceImpl;
import com.nus_iss.spring.backend.services.PaymentService;
import com.nus_iss.spring.backend.services.interfaces.NotificationService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

public class NotificationControllerTest {
    @Mock
    private NotificationServiceImpl notificationService;

    @InjectMocks
    private NotificationController notificationController;

    public NotificationControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateNotification() {
        // Arrange
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setId(1L);
        notificationDto.setMessage("testNotification");

        when(notificationService.createNotification(any(NotificationDto.class))).thenReturn("Test123");

        // Act
        ResponseEntity<String> response = notificationController.createNotification(notificationDto);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Test123", response.getBody());
    }

    @Test
    public void testUpdateNotification() {
        // Arrange
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setId(1L);
        notificationDto.setMessage("testUpdateNotification");

        when(notificationService.updateNotification(any(NotificationDto.class))).thenReturn("TestUpdate123");

        // Act
        ResponseEntity<String> response = notificationController.updateNotification(notificationDto);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("TestUpdate123", response.getBody());
    }
}
