package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/store")
public class StoreController {
    @Autowired
    StoreService storeService;
    @GetMapping
    public HttpEntity<?> getAll(){
        return storeService.getAll();
    }

    @PostMapping
    public HttpEntity<?> save(@RequestParam String name){
        return storeService.save(name);
    }
}
