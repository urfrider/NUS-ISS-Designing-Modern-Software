package com.nus_iss.spring.backend.services.interfaces;

import java.util.List;

import com.nus_iss.spring.backend.dtos.NotificationDto;

public interface NotificationService {
    
    // public void sendNotification(String message);

    public String createNotification(NotificationDto notificationDto);
    public String updateNotification(NotificationDto notificationDto);
    public List<NotificationDto> getNotificationsById(Long reciepientId);
}
