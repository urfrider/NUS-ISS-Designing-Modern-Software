package com.nus_iss.spring.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.dtos.NotificationDto;
import com.nus_iss.spring.backend.entities.Notification;
import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.mappers.NotificationMapper;
import com.nus_iss.spring.backend.repositories.NotificationRepository;
import com.nus_iss.spring.backend.repositories.UserRepository;
import com.nus_iss.spring.backend.services.interfaces.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public String createNotification(NotificationDto notificationDto) {

        Notification newNotification = NotificationMapper.toEntity(notificationDto);

        User existingUser = userRepository.findByUsername(notificationDto.getUser().getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        newNotification.setUser(existingUser);

        notificationRepository.save(newNotification);

        return "New notification created!";
    }

    @Override
    public String updateNotification(NotificationDto notificationDto) {

        Notification newNotification = NotificationMapper.toEntity(notificationDto);

        User existingUser = userRepository.findByUsername(notificationDto.getUser().getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        newNotification.setUser(existingUser);

        notificationRepository.findById(notificationDto.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.save(newNotification);

        return "Notification updated!";
    }
}
