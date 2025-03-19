package com.nus_iss.spring.backend.services.interfaces;

import com.nus_iss.spring.backend.dtos.NotificationDto;

public interface NotificationService {
    
    // public void sendNotification(String message);

    // public NotificationDto getNotification();

    public String createNotification(NotificationDto notificationDto);
    public String updateNotification(NotificationDto notificationDto);
}
