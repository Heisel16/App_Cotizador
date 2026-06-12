package com.example.API.service;

import com.example.API.model.Cotizacion;
import com.example.API.model.ItemCotizacion;
import com.example.API.repository.CotizacionRepository;
import com.example.API.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CotizacionService {

    private final CotizacionRepository cotizacionRepository;
    private final ProductoRepository productoRepository;

    public List<Cotizacion> listarTodas() {
        return cotizacionRepository.findAll();
    }

    public Cotizacion buscarPorId(String id) {
        return cotizacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cotizacion no encontrada: " + id));
    }

    public Cotizacion crear(Cotizacion cotizacion) {
        // Por cada item, busca el producto y calcula el subtotal
        for (ItemCotizacion item : cotizacion.getItems()) {
            productoRepository.findById(item.getProductoId()).ifPresent(producto -> {
                item.setPrecioUnitario(producto.getPrecio().doubleValue());
                item.setSubtotal(item.getPrecioUnitario() * item.getCantidad());
                item.setNombreProducto(producto.getNombre());
            });
        }

        // Calcula el total sumando todos los subtotales
        double total = cotizacion.getItems().stream()
                .mapToDouble(ItemCotizacion::getSubtotal)
                .sum();
        cotizacion.setTotal(total);

        return cotizacionRepository.save(cotizacion);
    }

    public Cotizacion actualizarEstado(String id, String estado) {
        Cotizacion cotizacion = buscarPorId(id);
        cotizacion.setEstado(estado);
        return cotizacionRepository.save(cotizacion);
    }

    public void eliminar(String id) {
        buscarPorId(id);
        cotizacionRepository.deleteById(id);
    }

    public List<Cotizacion> buscarPorEstado(String estado) {
        return cotizacionRepository.findByEstado(estado);
    }
}