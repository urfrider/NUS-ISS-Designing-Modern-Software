package com.nus_iss.spring.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.nus_iss.spring.backend.constants.Roles;
import com.nus_iss.spring.backend.dtos.BuyerDto;
import com.nus_iss.spring.backend.dtos.BuyerSellerDto;
import com.nus_iss.spring.backend.dtos.SellerDto;
import com.nus_iss.spring.backend.entities.AuthRequest;
import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.entities.Seller;
import com.nus_iss.spring.backend.services.BuyerServiceImpl;
import com.nus_iss.spring.backend.services.JwtService;
import com.nus_iss.spring.backend.services.SellerServiceImpl;
import com.nus_iss.spring.backend.services.UserInfoService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.security.core.Authentication;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserInfoService userService;
    @Autowired
    private SellerServiceImpl sellerService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private BuyerServiceImpl buyerService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not securesss";
    }

    @PostMapping("/addNewUser")
    public ResponseEntity<String> addNewUser(@RequestBody BuyerSellerDto userInfo) {
        try {
            return new ResponseEntity<>(userService.addUser(userInfo), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/user/userProfile")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
    public String userProfile() {
        return "Welcome to User Profile";
    }

    @GetMapping("/admin/adminProfile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }

    @PostMapping("/generateToken")
    public BuyerSellerDto authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            String username = authRequest.getUsername();
            User user = userService.findUserByUsername(username);
            String token = jwtService.generateToken(username);
            Long id = user.getId();

            BuyerSellerDto buyerSellerDto = new BuyerSellerDto();
            buyerSellerDto.setId(id);
            buyerSellerDto.setToken(token);
            buyerSellerDto.setUsername(user.getUsername());
            buyerSellerDto.setRole(user.getRole());
            buyerSellerDto.setBalance(user.getBalance());

            switch (user.getRole()) {
                case Roles.BUYER:
                    Buyer buyer = buyerService.getBuyerByUsername(username);
                    buyerSellerDto.setAddress(buyer.getAddress());
                    break;

                case Roles.SELLER:
                    Seller seller = sellerService.getSellerByUsername(username);
                    buyerSellerDto.setUen(seller.getUen());
                    break;

                default:
                    throw new IllegalArgumentException("Unsupported role: " + user.getRole());
            }

            return buyerSellerDto;
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

    @GetMapping("/buyerProfile")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<BuyerDto> getBuyerProfile(@RequestParam Long buyerId) {
        BuyerDto buyer = this.buyerService.getBuyerById(buyerId);

        if (buyer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(buyer);
    }

    @PostMapping("/buyerProfile")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<BuyerDto> editBuyerProfile(@RequestBody BuyerDto user) {
        BuyerDto buyer = this.buyerService.editBuyerProfile(user);
        if (buyer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(buyer);
    }

    @DeleteMapping("/buyerProfile")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<String> deleteBuyerProfile(@RequestParam Long buyerId) {
        BuyerDto buyer = this.buyerService.deleteBuyerProfile(buyerId);

        if (buyer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok("Buyer deleted successfully");
    }

    @GetMapping("/sellerProfile")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER')")
    public ResponseEntity<SellerDto> getSellerProfile(@RequestParam Long sellerId) {
        SellerDto seller = this.sellerService.getSellerById(sellerId); // Handle if buyer not found
        if (seller == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(seller);
    }

    @PostMapping("/sellerProfile")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER')")
    public ResponseEntity<SellerDto> editSellerProfile(@RequestBody SellerDto user) {
        SellerDto seller = this.sellerService.editSellerProfile(user);

        if (seller == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(seller);
    }

    @DeleteMapping("/sellerProfile")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER')")
    public ResponseEntity<String> deleteSellerProfile(@RequestParam Long sellerId) {
        SellerDto seller = this.sellerService.deleteSellerProfile(sellerId);

        if (seller == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok("Seller deleted successfully");
    }

}
