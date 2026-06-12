package com.example.API.repository;

import com.example.API.model.producto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends MongoRepository<producto, String> {
    List<producto> findByCategoria(String categoria);
    List<producto> findByDisponible(boolean disponible);
    List<producto> findByNombreContainingIgnoreCase(String nombre);
}
