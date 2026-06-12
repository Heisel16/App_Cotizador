package com.example.API.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ItemCotizacion {
    @NotBlank
    private String productoId;

    @NotBlank
    private String nombreProducto;

    @Positive
    private Integer cantidad;

    private Double precioUnitario;

    private Double subtotal;

}
