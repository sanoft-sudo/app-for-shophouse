package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.ProductType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductTypeService {
    @Autowired
    ProductTypeRepository productTypeRepository;

    public HttpEntity<?> save(String name){
        try {
            ProductType save = productTypeRepository.save(new ProductType(name));
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    };

    public HttpEntity<?> delete(UUID productTypeId){
        try {
            productTypeRepository.deleteById(productTypeId);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getAll(){
        try {
            List<ProductType> all = productTypeRepository.findAll();
            return ResponseEntity.ok(new ApiResponse("success", true, all));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getOne(UUID productTypeId){
        try {
            return ResponseEntity.ok(new ApiResponse("success", true, productTypeRepository.findById(productTypeId)));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
