import React from "react";
import "./styles/style_vaccination.css";
import Navigation from "./layout/Nav_vaccin";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
function VaccinationService({
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
      <div className="main-container-141">

          <Navigation />
        
        <span className="dich-vu-tiem-vac-xin-141">
          dịch vụ tiêm vắc xin cho chó mèo tại PetStore
        </span>
        <div className="flex-row-ea-141">
          <div className="petsstore-141">
            <span className="pets-b-141">Pets</span>
            <span className="store-c-141">Store</span>
          </div>
          <div className="rectangle-d-141" />
          <div className="rectangle-e-141" />
        </div>
        <div className="flex-row-141">
          <span className="tiem-phong-vac-xin-141">
            tiêm phòng vắc xin tại petStore đảm bảo những gì
          </span>
          <div className="rectangle-f-141">
            <span className="kiem-tra-suc-khoe-141">
              được kiểm tra sức khỏe trước khi tiêm vắc xin
            </span>
            <span className="thu-cung-khi-den-141">
              các thú cưng khi đến với petStore sẽ được đội ngũ nhân viên bác sĩ
              kiểm tra sức khỏe hiện tại của các bé xem có bị bệnh nào không, có
              ổn dịnh hay không <br />
              .ngoài ra các bác sĩ còn tư vấn hữu ích giúp chủ nhân của các bé
              chó,mèo chăm sóc các bé tốt hơn tại nhà
            </span>
            <span className="su-dung-vac-xin-141">
              sử dụng các loại vắc xin chất lượng tốt và độ an toàn cao
            </span>
            <span className="vac-xin-chat-luong-141">
              để giúp các bé chó,mèo có sức khỏe,sự đề kháng tốt nhất. Phòng
              khám thú y tại petStore luôn sử dụng các loại vắc xin có chất
              lượng cao. đây là những <br />
              loại vắc xin đạt tiêu chuẩn cao được nhập khẩu từ mỹ,pháp,...
            </span>
            <span className="moi-truong-tiem-phong-141">
              môi trường tiêm phòng an toàn
            </span>
            <span className="doi-ngu-thu-y-141">
              đội ngũ thú y chuyên nghiệp và tin cậy
            </span>
            <span className="nhan-vien-bac-si-141">
              Nhân viên bác sĩ thú y PetStore không chỉ có chuyên môn tốt, mà
              còn rất yêu quý động vật. Chúng tôi còn là những người có kinh
              nghiệm tiếp xúc, chăm sóc với các bé thú cưng. Do đó, chó mèo sẽ
              cảm thấy thoải mái, không lo âu và căng thẳng khi tham gia tiêm
              chủng các loại vắc xin tại PetStore.
            </span>
            <span className="lich-tiem-phong-cho-cho-meo-141">
              lịch tiêm phòng cho chó mèo
            </span>
            <span className="lich-tiem-phong-cho-cho-141">
              lịch tiêm phòng cho chó
            </span>
            <span className="cho-6-tuan-tuoi-141">
              - Chó được 6 tuần tuổi: Tiêm vắc xin tổng hợp mũi đầu tiên
            </span>
            <span className="cho-9-tuan-tuoi-141">
              - 9 tuần tuổi tiêm mũi 2 vắc xin tổng hợp 7 bệnh: bệnh carre
              virus, bệnh do Parvo virus. bệnh viêm gan truyền nhiễm, bệnh ho
              cũi chó. bệnh phó củm. bệnh &nbsp; &nbsp; &nbsp; &nbsp;  do Leptospira, bệnh coronavirus.
            </span>
            <span className="cho-12-tuan-tuoi-141">
              - 12 tuần tuổi: Tiêm mũi 3 vắc xin tổng hợp 7 bệnh
            </span>
            <span className="cho-15-tuan-tuoi-141">
              - Chó được 15 tuần tuổi: Tiêm 1 mũi vắc xin phòng bệnh chó dại –
              rabires. Đây là loại vắc xin tiêm phòng bắt buộc tại Việt Nam
            </span>
            <span className="cho-tiem-nhac-lai-141">
              - Chó cần tiêm nhắc lại định kỳ hàng năm sau đó: 1 mũi 7 bệnh và 1
              mũi phòng dại.
            </span>
            <span className="lich-tiem-phong-cho-meo-141">
              lịch tiêm phòng cho mèo
            </span>
            <span className="meo-6-8-tuan-tuoi-141">
              - Khi mèo được 6 – 8 tuần tuổi tiêm vắc xin tổng hợp mũi đầu tiên:
              bệnh giảm bạch cầu, bệnh viêm mũi – khí quản truyền nhiễm, bệnh hô
              hấp do herpevirus.
            </span>
            <span className="meo-9-12-tuan-tuoi-141">
              - Mèo từ 9 - 12 tuần tuổi tiêm vắc xin tổng hợp mũi 2
            </span>
            <span className="meo-16-tuan-tuoi-141">
              - Từ 16 tuần tuổi tiêm vắc xin phòng bệnh dại.
            </span>
            <span className="meo-tiem-nhac-lai-141">
              - Hàng năm, mèo vẫn cần tiêm nhắc lại, bao gồm vắc xin tổng hợp
              phòng trên cùng vắc xin tiêm phòng bệnh dại.
            </span>
            <span className="luu-y-khi-tiem-phong-141">
              lưu ý khi tiêm phòng vắc xin cho chó mèo
            </span>
            <span className="khong-nen-tiem-phong-141">
              Không nên tiêm phòng cho các bé mới đón về nhà trong vòng 7 - 10
              ngày đầu. Vì như vậy các bé chưa có sức khỏe đủ tốt.
            </span>
            <span className="khong-nen-an-sau-tiem-phong-141">
              Không nên để các bé ăn các thức ăn nhiều mỡ, sữa và đồ tanh sau
              khi tiêm phòng.
            </span>
            <span className="khong-nen-tiem-phong-neu-co-bieu-hien-141">
              Các bé có biểu hiện lạ và dấu hiệu sức khỏe không tốt thì không
              nên tiêm phòng vắc xin.
            </span>
            <span className="nen-kieng-tam-sau-tiem-phong-141">
              Nên kiêng tắm 1 tuần cho các bé sau khi tiêm phòng.
            </span>
            <span className="can-tiem-phong-day-du-141">
              Cần tiêm phòng đầy đủ các mũi và tiêm nhắc lại định kỳ mỗi năm.
            </span>
            <span className="sau-khi-tiem-141">
              Sau khi tiêm phòng 1 tuần thì cần tiến hành tẩy giun.
            </span>
            <span className="text-2f-141">
              Một vài bé sau khi tiêm có thể sốt nhẹ, bỏ ăn một vài buổi là dấu
              hiệu bình thường. Đó là do phản ứng của hệ thống miễn dịch trong
              quá trình tạo kháng thể của thú cưng
            </span>
            <button className="rectangle-11-141">
              <span className="lien-he-lich-141">
                liên hệ lịch tiêm ngay cho petStore chúng tôi
              </span>
              <span className="hotline-141">hotline: 0336343299</span>
            </button>
            <div className="object-141" />
            <span className="petstore-an-toan-141">
              PetStore luôn đảm bảo tiêm phòng được thực hiện trong một môi
              trường an toàn và sạch sẽ. Khu vực tiêm phòng được khử trùng hàng
              ngày và được trang bị máy xịt khử trùng tự động để đảm bảo sự tiệt
              trùng và thơm tho. trên hết PetStore không điều trị các bệnh
              truyền nhiễm. bạn có thể yên tâm thú cưng của bạn sẽ không phải lo
              lắng về nguy cơ nhiễm bệnh khi đến tiêm phòng tại PetStore.
            </span>

            <button className="rectangle-13-141">
              <span className="lien-he-lich-14-141">
                liên hệ lịch tiêm ngay cho petStore chúng tôi
              </span>
              <span className="hotline-15-141">hotline: 0336343299</span>
            </button>
  
          </div>
          <div className="inner-plugin-iframe-141" />
          <div className="inner-plugin-iframe-17-141" />
        </div>
        <span className="petstore-copyright-141">
          petStore copyright @ 2024
        </span>
        <Footer />
      </div>
    </>
  );
}

export default VaccinationService;
