package com.nus_iss.spring.backend.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.nus_iss.spring.backend.dtos.BuyerSellerDto;
import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.services.BuyerServiceImpl;
import com.nus_iss.spring.backend.services.JwtService;
import com.nus_iss.spring.backend.services.SellerServiceImpl;
import com.nus_iss.spring.backend.services.UserInfoService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserInfoService userService;

    @Mock
    private JwtService jwtService;

    @Mock
    private BuyerServiceImpl buyerService;

    @Mock
    private SellerServiceImpl sellerService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void testWelcomeEndpoint() throws Exception {
        mockMvc.perform(get("/auth/welcome"))
                .andExpect(status().isOk())
                .andExpect(content().string("Welcome this endpoint is not securesss"));
    }

    @Test
    void testAddNewUser_Buyer() throws Exception {
        BuyerSellerDto userDto = new BuyerSellerDto();
        userDto.setUsername("testBuyer");
        userDto.setRole("ROLE_BUYER");
        userDto.setAddress("Havelock");

        when(userService.addUser(any(BuyerSellerDto.class))).thenReturn("User added!");

        mockMvc.perform(post("/auth/addNewUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testBuyer\",\"role\":\"ROLE_BUYER\",\"address\":\"Havelock\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("User added!"));

        verify(userService, times(1)).addUser(any(BuyerSellerDto.class));
    }

    @Test
    void testAddNewUser_Seller() throws Exception {
        BuyerSellerDto userDto = new BuyerSellerDto();
        userDto.setUsername("testSeller");
        userDto.setRole("ROLE_SELLER");
        userDto.setUen("Havelock");

        when(userService.addUser(any(BuyerSellerDto.class))).thenReturn("User added!");

        mockMvc.perform(post("/auth/addNewUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testSeller\",\"role\":\"ROLE_SELLER\",\"uen\":\"Havelock\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("User added!"));

        verify(userService, times(1)).addUser(any(BuyerSellerDto.class));
    }

    @Test
    void testAuthenticateAndGetToken() throws Exception {
        // Arrange
        // AuthRequest authRequest = new AuthRequest("testUser", "password");
        User user = new User();
        user.setUsername("testUser");
        user.setRole("ROLE_BUYER");

        Buyer buyer = new Buyer();
        buyer.setAddress("123 Test Street");

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userService.findUserByUsername("testUser")).thenReturn(user);
        when(jwtService.generateToken("testUser")).thenReturn("mocked_token");
        when(buyerService.getBuyerByUsername("testUser")).thenReturn(buyer);

        // Act & Assert
        mockMvc.perform(post("/auth/generateToken")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testUser\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked_token"))
                .andExpect(jsonPath("$.username").value("testUser"))
                .andExpect(jsonPath("$.role").value("ROLE_BUYER"));
    }
}