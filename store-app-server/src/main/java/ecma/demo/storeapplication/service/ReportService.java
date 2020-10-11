package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomDeliver;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.repository.DeliverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReportService {
    @Autowired
    DeliverRepository deliverRepository;

    public HttpEntity<?> getCurrentProduct(String param, UUID productId, String search, Integer page, Integer size) {
         Pageable pageable= PageRequest.of(page - 1, size);
        if (param.equalsIgnoreCase("deliver")){
            Page<CustomDeliver> delivers = deliverRepository.getAllDelivers(pageable, productId, search);
            return ResponseEntity.ok(new ApiResponse("success", true,delivers));
        } else {
            return null;
        }

    }
}
