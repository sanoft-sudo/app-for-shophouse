package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.Attachment;
import ecma.demo.storeapplication.entity.Role;
import ecma.demo.storeapplication.entity.User;
import ecma.demo.storeapplication.entity.enums.RoleName;
import ecma.demo.storeapplication.exception.ResourceNotFoundException;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqUser;
import ecma.demo.storeapplication.repository.AttachmentRepository;
import ecma.demo.storeapplication.repository.RoleRepository;
import ecma.demo.storeapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AttachmentRepository attachmentRepository;

    public HttpEntity<?> getAll(){
        List<User> all = userRepository.findAll();
        return ResponseEntity.ok(new ApiResponse("success", true, all));
    }





    public HttpEntity<?> save(ReqUser reqUser){
//        Attachment attachment=null;
        try {
            Optional<User> username = userRepository.findByUsername(reqUser.getUsername());
            if(username.isPresent()){
                return ResponseEntity.ok(new ApiResponse("failed", false));
            }
            List<Role> roles=new ArrayList<>();
            Role role= roleRepository.findByRoleName(RoleName.valueOf(reqUser.getRoleName()));
            roles.add(role);
//            if(reqUser.getAttachmentId()!=null){
//                Optional<Attachment> optionalAttachment = attachmentRepository.findById(reqUser.getAttachmentId());
//                if(optionalAttachment.isPresent()){
//                    attachment=optionalAttachment.get();
//                }
//            }
            Attachment attachment = attachmentRepository.findById(reqUser.getAttachmentId()).get();
            User save = userRepository.save(new User(
                    reqUser.getFirstName(),
                    reqUser.getLastName(),
                    reqUser.getPhoneNumber(),
                    reqUser.getPassportSerial(),
                    reqUser.getPassportNumber(),
                    reqUser.getUsername(),
                    passwordEncoder.encode(reqUser.getPassword()),
                    roles,
                    attachment
            ));
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> edit(ReqUser reqUser, UUID userId){
        try {
            User username = userRepository.findByUsername(reqUser.getUsername()).get();
            User user = userRepository.findById(userId).get();
            if(username.getId()!=user.getId()){
                return ResponseEntity.ok(new ApiResponse("failed", false));
            }
            List<Role> roles=new ArrayList<>();
            Role role= roleRepository.findByRoleName(RoleName.valueOf(reqUser.getRoleName()));
            roles.add(role);

            user.setFirstName(reqUser.getFirstName());
            user.setLastName(reqUser.getLastName());
            user.setUsername(reqUser.getUsername());
            user.setPassportSerial(reqUser.getPassportSerial());
            user.setPassportNumber(reqUser.getPassportNumber());
            user.setRoles(roles);
            User save = userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> deleteUser(UUID id) {
        try {
//            User user = userRepository.findById(id).get();
            userRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("success",true));
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
