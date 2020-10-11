package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.Store;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class StoreService {
    @Autowired
    StoreRepository storeRepository;
    public HttpEntity<?> getAll(){
        try {
            return ResponseEntity.ok(new ApiResponse("success", true, storeRepository.findAll()));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false, storeRepository.findAll()));
        }
    }

    public HttpEntity<?> save(String name){
        try {
            Store save = storeRepository.save(new Store(name));
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", true));
        }
    }
}