package com.example.API.controller;

import com.example.API.model.Cotizacion;
import com.example.API.service.CotizacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/cotizaciones")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionService cotizacionService;

    @GetMapping
    public ResponseEntity<List<Cotizacion>> listar() {
        return ResponseEntity.ok(cotizacionService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cotizacion> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(cotizacionService.buscarPorId(id));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Cotizacion>> buscarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(cotizacionService.buscarPorEstado(estado));
    }

    @PostMapping
    public ResponseEntity<Cotizacion> crear(@Valid @RequestBody Cotizacion cotizacion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cotizacionService.crear(cotizacion));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Cotizacion> actualizarEstado(@PathVariable String id, @RequestParam String estado) {
        return ResponseEntity.ok(cotizacionService.actualizarEstado(id, estado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        cotizacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}