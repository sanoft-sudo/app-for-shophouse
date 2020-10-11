package ecma.demo.storeapplication.custom;

import java.util.UUID;

public interface CustomProduct {

    UUID getId();

    String getName();

//    Double getSalePrice();

    UUID getAttachmentId();

    Double getRetailPrice();
}
