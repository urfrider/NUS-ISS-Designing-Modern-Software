package com.nus_iss.spring.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nus_iss.spring.backend.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReciepientId(Long reciepientId);
}
