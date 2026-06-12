package com.example.API.model;
import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "productos")

public class producto {
    @Id
    private String id;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombre;
    
    private String descripcion;

    @NotNull
    @Positive
    private BigDecimal precio;

    private String categoria;
    
    private String unidad;

    @Builder.Default
    private Boolean disponible = true;
}
