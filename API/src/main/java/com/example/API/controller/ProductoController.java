package com.example.API.controller;
import com.example.API.model.producto;
import com.example.API.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {
    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<producto>> listarProductos() {
        return ResponseEntity.ok(productoService.ListarProductosActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<producto> obtenerProducto(@PathVariable String id) {
        return ResponseEntity.ok(productoService.buscarPorId(id));
    }

    @PostMapping("/buscar")
    public ResponseEntity<List<producto>> buscarProductos(@RequestParam String nombre) {
        return ResponseEntity.ok(productoService.buscarPorNombre(nombre));
    }

    @PostMapping
    public ResponseEntity<producto> crearProducto(@Valid @RequestBody producto producto) {
        return new ResponseEntity<>(productoService.crear(producto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<producto> actualizarProducto(@PathVariable String id, @Valid @RequestBody producto producto) {
        return ResponseEntity.ok(productoService.actualizar(id, producto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable String id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
