package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomClient;
import ecma.demo.storeapplication.custom.CustomProduct;
import ecma.demo.storeapplication.custom.CustomProductRemain;
import ecma.demo.storeapplication.custom.CustomStoreProduct;
import ecma.demo.storeapplication.entity.Attachment;
import ecma.demo.storeapplication.entity.Category;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.entity.ProductType;
import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqProduct;
import ecma.demo.storeapplication.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;
    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    DeliverRepository deliverRepository;
    @Autowired ProductTypeRepository productTypeRepository;

    public HttpEntity<?> getById(String id) {
        CustomProduct product = productRepository.findByProductId(UUID.fromString(id));
        Double productAmount = deliverRepository.productAmount(UUID.fromString(id));
        return ResponseEntity.ok(new ApiResponse("success", true, product, productAmount));
    }

    public HttpEntity<?> getBySearch(String search, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productBySearch = productRepository.findBySearch(search, pageable);

        return ResponseEntity.ok(new ApiResponse("success", true, productBySearch));
    }

    public HttpEntity<?> getByCategory(String parentId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        UUID parent_uuid = UUID.fromString(parentId);
        Page<Product> productByParentId = productRepository.findByParentId(parent_uuid, pageable);

        return ResponseEntity.ok(new ApiResponse("success", true, productByParentId));
    }

    public HttpEntity<?> getStoreProduct(UUID uuid) {
        try {
            List<CustomStoreProduct> storeProduct = productRepository.findStoreProduct(uuid);
            System.out.println(storeProduct.get(0).getEnding_amount());
            return ResponseEntity.ok(new ApiResponse("success", true, storeProduct.get(0)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }


    }

    public HttpEntity<?> save(ReqProduct reqProduct) {
        Category parent=null;
        Attachment attachment=null;
        ProductType productType=null;
        try {
            if(reqProduct.getCategoryId()!=null){
                Optional<Category> optionalParent = categoryRepository.findById(reqProduct.getCategoryId());
                if(optionalParent.isPresent()){
                    parent=optionalParent.get();
                }
            }
            if(reqProduct.getAttachmentId()!=null){
                Optional<Attachment> optionalAttachment = attachmentRepository.findById(reqProduct.getAttachmentId());
                if(optionalAttachment.isPresent()){
                    attachment=optionalAttachment.get();
                }
            }
            if(reqProduct.getProductTypeId()!=null){
                Optional<ProductType> optionalProductType = productTypeRepository.findById(reqProduct.getProductTypeId());
                if(optionalProductType.isPresent()){
                    productType=optionalProductType.get();
                }
            }
            productRepository.save(new Product(reqProduct.getName(), attachment, parent, productType, CurrencyType.UZS, (double)0, (double)0, (double)0, (double)0, (double)0, (double)0, (double)0, (double)0));
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> edit(UUID id, ReqProduct reqProduct) {

        Product product = productRepository.findById(id).get();

        Category parent=null;
        Attachment attachment=null;
        ProductType productType=null;
        try {
            if(reqProduct.getCategoryId()!=null){
                Optional<Category> optionalParent = categoryRepository.findById(reqProduct.getCategoryId());
                if(optionalParent.isPresent()){
                    parent=optionalParent.get();
                }
            }
            if(reqProduct.getAttachmentId()!=null){
                Optional<Attachment> optionalAttachment = attachmentRepository.findById(reqProduct.getAttachmentId());
                if(optionalAttachment.isPresent()){
                    attachment=optionalAttachment.get();
                }
            }
            if(reqProduct.getProductTypeId()!=null){
                Optional<ProductType> optionalProductType = productTypeRepository.findById(reqProduct.getProductTypeId());
                if(optionalProductType.isPresent()){
                    productType=optionalProductType.get();
                }
            }

            product.setAttachment(attachment);
            product.setName(reqProduct.getName());
            product.setCategory(parent);
            product.setProductType(productType);
            productRepository.save(product);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> delete(UUID id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> editField(UUID id, String field, String fieldName) {
        Product product = productRepository.findById(id).get();
        try {
            if(fieldName.equals("retailPrice")){
                product.setRetailPrice(Double.valueOf(field));
            }
            if(fieldName.equals("fullSalePrice")){
                product.setFullSalePrice(Double.valueOf(field));
            }
            Product save = productRepository.save(product);
            List<CustomStoreProduct> storeProduct = productRepository.findStoreProduct(id);
            return ResponseEntity.ok(new ApiResponse("success", true, storeProduct.get(0)));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> getProductRemain(String search, Integer page, Integer size, String sort){
        Pageable pageable=PageRequest.of(page,10);
        List<CustomProductRemain> productRemain = productRepository.getProductRemain(search, page, size);
        sort(productRemain, sort);
        Page<CustomProductRemain> responsePage= new PageImpl<CustomProductRemain>(productRemain, PageRequest.of(page, size), productRepository.getCount());
        return ResponseEntity.ok(new ApiResponse("success", true, responsePage));
    }



    private List<CustomProductRemain> sort(List<CustomProductRemain> custom, String sortBy) {
        if (sortBy.equals("up")) {
            Comparator<CustomProductRemain> compareByAmount = (CustomProductRemain o1, CustomProductRemain o2) -> o1.getAmount().compareTo(o2.getAmount());
            Collections.sort(custom, compareByAmount.reversed());
        }else if (sortBy.equals("down")) {
            Comparator<CustomProductRemain> compareByAmount = (CustomProductRemain o1, CustomProductRemain o2) -> o1.getAmount().compareTo(o2.getAmount());
            Collections.sort(custom, compareByAmount);
        }
        return custom;
    }

//    public HttpEntity<?> findProduct(UUID id) {
//
//        try {
//            CustomProduct product = productRepository.findProduct(id);
//            return ResponseEntity.ok(new ApiResponse("success", true, product));
//        }catch (Exception e ){
//            return ResponseEntity.ok(new ApiResponse("success", false ));
//
//        }
//    }
}
