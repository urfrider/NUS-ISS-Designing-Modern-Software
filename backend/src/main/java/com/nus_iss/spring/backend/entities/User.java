package com.nus_iss.spring.backend.entities;

import com.nus_iss.spring.backend.dtos.NotificationDto;
import com.nus_iss.spring.backend.observer.interfaces.Observer;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements Observer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String role;

    private Double balance;

    @Override
    public void receiveNotification(NotificationDto notification) {
        if (this.id != null && this.id.equals(notification.getReciepientId())) {
            System.out.println("User [" + username + "] received: " + notification.getMessage());
        }
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + (id != null ? id : "null") +
                ", username='" + (username != null ? username : "null") + '\'' +
                ", role='" + (role != null ? role : "null") + '\'' +
                ", balance=" + (balance != null ? balance : "null") +
                '}';
    }
}
