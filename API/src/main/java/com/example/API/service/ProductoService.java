package com.example.API.service;
import com.example.API.model.producto;
import com.example.API.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository productoRepository;

    public List<producto> ListarProductosActivos() {
        return productoRepository.findByDisponible(true);
    }

    public producto buscarPorId(String id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + id));
    }

    public producto crear(producto producto) {
        return productoRepository.save(producto);
    }

    public producto actualizar(String id, producto datos) {
        producto existente = buscarPorId(id);
        existente.setNombre(datos.getNombre());
        existente.setDescripcion(datos.getDescripcion());
        existente.setPrecio(datos.getPrecio());
        existente.setCategoria(datos.getCategoria());
        existente.setUnidad(datos.getUnidad());
        return productoRepository.save(existente);
    }

    public void eliminar(String id) {
        producto existente = buscarPorId(id);
        existente.setDisponible(false);
        productoRepository.save(existente);
    }

    public List<producto> buscarPorCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    public List<producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }
}
