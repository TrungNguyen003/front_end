import React from "react";
import "./styles/style_petcare.css";
import Header from "./layout/Header";
import Navigation from "./layout/Navigation";
import { Link } from "react-router-dom";
import Footer from "./layout/Footer";
function PetCareServices({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) {
  return (
    <>
      {" "}
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      
      <div className="main-container-140">

      <Navigation />
        <div className="flex-row-fd-140">
          <div className="rectangle-11-140">
            <span className="dich-vu-cham-soc-cho-meo-tai-petstore-140">
              dịch vụ chăm sóc chó mèo tại petStore
            </span>
            <div className="flex-row-bd-140">
              <div className="petsstore-140">
                <span className="pets-12-140">Pets</span>
                <span className="store-13-140">Store</span>
              </div>
              <div className="rectangle-14-140" />
              <div className="rectangle-15-140" />
            </div>
            <div className="flex-row-c-140">
              <span className="tiem-phong-cho-cho-meo-140">
               <Link to="/Dich-vu-tiem">tiêm phòng cho chó mèo <i class="fa-solid fa-chevron-right"></i></Link> 
              </span>
              <div className="ellipse-16-140" />
              <div className="image-140">
                {/* <div className='vector-17-140' /> */}
                <div className="object-140" />
              </div>
              <div className="ph-syringe-140">
                <div className="vector-18-140" />
              </div>
              <span className="tiem-phong-day-du-140">
                tiêm phòng đầy đủ và theo đúng liệu trình để đảm bảo sức khỏe
                tốt nhất cho chó mèo của bạn 
              </span>
              {/* <div className='vector-19-140' /> */}
              <span className="grooming-cat-tia-140">
                grooming,cắt tỉa,nhuộm lông cho chó mèo <i class="fa-solid fa-chevron-right"></i>
              </span>
              <div className="ellipse-1a-140" />
              <div className="mingcute-scissors-line-140">
                <div className="group-1b-140">
                  <div className="vector-1c-140" />
                  <div className="vector-1d-140" />
                </div>
              </div>
              <span className="grooming-lam-dep-cho-140">
                grooming làm đẹp cho chó mèo của bạn tại PetStore với các bạn
                nhân viên được đào tạo bài bản 
              </span>
             <Link to="/Dich-vu-tam"><span className="dich-vu-tam-cho-140">dịch vụ tắm cho chó <i class="fa-solid fa-chevron-right"></i></span></Link> 
              <div className="ellipse-1e-140" />
              <div className="lucide-bath-140">
                <div className="vector-1f-140" />
              </div>
              {/* <div className='vector-20-140' /> */}
              <span className="dich-vu-petstore-140">
                dịch vụ tại petStore bao gồm: tắm,vệ sinh tai,cắt móng chân,sấy
                khô giúp các bé trở nên sạch sẽ thoải mái 
              </span>
              <span className="dich-vu-tri-ve-140">
                dịch vụ trị ve,bọ chét,rận <i class="fa-solid fa-chevron-right"></i>
              </span>
              <div className="ellipse-21-140" />
              <div className="healthicons-virus-sanitizer-spray-140">
                <div className="group-22-140" />
              </div>
              <span className="giai-phap-tri-ve-140">
                giải pháp trị ve,rận,bọ chét trên chó mèo hiệu quả sau 1 lần 
              </span>
              <span className="trong-giu-cho-meo-140">
                trông giữ chó mèo tại petStore <i class="fa-solid fa-chevron-right"></i>
              </span>
              <div className="ellipse-23-140" />
              <div className="fluent-emoji-high-contrast-house-140">
                <div className="group-24-140">
                  <div className="clip-path-group-140" />
                </div>
              </div>
              <span className="cham-soc-cho-meo-140">
                chúng tôi sẽ giúp bạn chăm sóc các bé chó mèo khi các bạn đi du
                lịch,về quê hay có việc bận mà các bạn không thể mang theo các
                bé chó mèo 
              </span>
            </div>
          </div>
          <div className="inner-plugin-iframe-140" />
          <div className="inner-plugin-iframe-25-140" />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default PetCareServices;
