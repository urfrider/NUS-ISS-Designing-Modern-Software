package com.nus_iss.spring.backend.mappers;


import java.util.List;
import java.util.stream.Collectors;

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
        dto.setSenderId(notification.getSenderId());
        dto.setReciepientId(notification.getReciepientId());

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
        notification.setSenderId(notificationDto.getSenderId());
        notification.setReciepientId(notificationDto.getReciepientId());

        return notification;
    }

    public static List<NotificationDto> toDtoList(List<Notification> notifications) {
        return notifications.stream()
            .map(n -> new NotificationDto(
                n.getId(),
                n.getSenderId(),
                n.getMessage(),
                n.getType(),
                n.getCreatedAt(),
                n.getIsRead(),
                n.getReciepientId()
            ))
            .collect(Collectors.toList());
    }
}
