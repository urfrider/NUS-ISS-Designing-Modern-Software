package com.nus_iss.spring.backend.controllers;

import com.nus_iss.spring.backend.dtos.NotificationDto;
import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.observer.NotificationManager;
import com.nus_iss.spring.backend.repositories.UserRepository;
import com.nus_iss.spring.backend.services.NotificationServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class NotificationControllerTest {
    @Mock
    private NotificationServiceImpl notificationService;

    @InjectMocks
    private NotificationController notificationController;

    public NotificationControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationManager notificationManager;


    @Test
    public void testCreateNotification() {
        // Arrange
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setId(1L);
        notificationDto.setMessage("testNotification");

        // Mock the response from notificationService.createNotification
        when(notificationService.createNotification(any(NotificationDto.class))).thenReturn("Test123");

        // Mock userRepository to return a list of users
        List<User> mockUsers = new ArrayList<>();
        mockUsers.add(new User());  // Add mock users as needed
        when(userRepository.findAll()).thenReturn(mockUsers);

        // Act
        ResponseEntity<String> response = notificationController.createNotification(notificationDto);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Test123", response.getBody());

        // Verify interactions with mocked dependencies
        verify(notificationService).createNotification(any(NotificationDto.class));
        verify(userRepository).findAll();
        verify(notificationManager).addObserver(any(User.class));
        verify(notificationManager).notifyObservers(notificationDto);
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
