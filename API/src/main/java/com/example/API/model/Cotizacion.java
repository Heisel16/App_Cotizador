package com.example.API.model;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "cotizaciones")
@Data
@NoArgsConstructor

public class Cotizacion {
    @Id
    private String id;

    @NotBlank
    private String cliente;

    private String telefono;

    private List<ItemCotizacion> items;

    private Double total;
    
    private String estado = "PENDIENTE";

    private LocalDateTime fechaCreacion = LocalDateTime.now();
}
