package com.example.API.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.API.model.Cotizacion;

@Repository
public interface CotizacionRepository extends MongoRepository<Cotizacion, String> {

    List<Cotizacion> findByEstado(String estado);

    List<Cotizacion> findByClienteContainingIgnoreCase(String cliente);
}