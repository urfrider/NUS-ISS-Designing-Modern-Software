package com.nus_iss.spring.backend.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nus_iss.spring.backend.dtos.NotificationDto;
import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.observer.NotificationManager;
import com.nus_iss.spring.backend.repositories.UserRepository;
import com.nus_iss.spring.backend.services.NotificationServiceImpl;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/notif")
public class NotificationController {

    @Autowired
    private NotificationServiceImpl notificationServiceImpl;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationManager notificationManager;

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);


    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome, the notification endpoint is working!";
    }

    @PostMapping("/createNotification")
    public ResponseEntity<String> createNotification(@RequestBody NotificationDto notificationDto) {
        try {

            String result = notificationServiceImpl.createNotification(notificationDto);

            List<User> allUsers = userRepository.findAll();
            for (User user : allUsers) {
                notificationManager.addObserver(user);
            }

            notificationManager.notifyObservers(notificationDto);

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }
    
    @PostMapping("/updateNotification")
    public ResponseEntity<String> updateNotification(@RequestBody NotificationDto notificationDto) {
        try {
            return new ResponseEntity<>(notificationServiceImpl.updateNotification(notificationDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @GetMapping("/getNotifications")
    public ResponseEntity<List<NotificationDto>> getNotificationsById(@RequestParam Long userId) {
        try {
            return new ResponseEntity<>(notificationServiceImpl.getNotificationsById(userId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
