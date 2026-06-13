package com.example.API.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class Api {
    
    @GetMapping
    public String home() {
        return "API Cotizador funcionando correctamente";
    }
}
