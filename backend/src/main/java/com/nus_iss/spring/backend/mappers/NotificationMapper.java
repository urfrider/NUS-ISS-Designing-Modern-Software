package com.nus_iss.spring.backend.mappers;

import java.util.Date;

import com.nus_iss.spring.backend.dtos.NotificationDto;
import com.nus_iss.spring.backend.entities.Notification;

public class NotificationMapper {
    
    public static NotificationDto toDto(Notification notification) {
        if (notification == null) {
            return null;
        }

        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setIsRead(notification.getIsRead());
        dto.setUser(UserMapper.toBuyerSellerDto(notification.getUser()));

        return dto;
    }

    public static Notification toEntity(NotificationDto notificationDto) {
        if (notificationDto == null) {
            return null;
        }

        Notification notification = new Notification();
        notification.setId(notificationDto.getId());
        notification.setMessage(notificationDto.getMessage());
        notification.setType(notificationDto.getType());
        notification.setCreatedAt(notificationDto.getCreatedAt());
        notification.setIsRead(notificationDto.getIsRead());
        notification.setUser(UserMapper.toEntity(notificationDto.getUser()));
        System.out.println("Update " + notification);
        return notification;
    }
}
