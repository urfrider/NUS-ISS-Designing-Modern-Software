package com.nus_iss.spring.backend.observer.interfaces;

import com.nus_iss.spring.backend.dtos.NotificationDto;

public interface Observer {
    void receiveNotification(NotificationDto notification);
}