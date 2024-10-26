import React from "react";
import "./styles/style_bath.css";
import Header from "./layout/Header";
import Navigation from "./layout/Nav_vaccin";
import Footer from "./layout/Footer";
import { Link } from "react-router-dom";
function BathService({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  return (
    <>
      {" "}
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="main-container-142">
        <Navigation />
        <div className="flex-row-edd-142">
          <div className="rectangle-c-142">
            <span className="bathing-service-petstore-142">
              dịch vụ tắm chó mèo tại petStore
            </span>
            <div className="flex-row-bc-142">
              <div className="petstore-142">
                <span className="pets-d-142">Pets</span>
                <span className="store-e-142">Store</span>
              </div>
              <div className="rectangle-f-142" />
              <div className="rectangle-10-142" />
            </div>
            <span className="exhausted-pet-care-142">
              Bạn có mệt mỏi khi phải vật lộn với thú cưng của mình khi tẩm cho
              chúng không? Bạn có lo lắng về cắt tia mòng? hay bộ lông của chúng
              đang trở nên rồi, dính bần và đầy bụi đất? việc sấy lông cho chúng
              có làm bạn vất và và mất quá nhiều thời gian?
            </span>
            <span className="petstore-appointment-142">
              bạn hãy đến ngay với cửa hàng petStore chúng tôi, chúng tôi sẽ
              giúp bạn làm điều đó để bạn có những phút giây thoải mái nghỉ
              ngơi.hãy gọi cho chúng tôi hôm nay để đặt lịch tắm cho các bé nhé
            </span>
            <div className="flex-row-c-142">
              <span className="pet-grooming-service-142">
                dịch vụ tắm chó mèo
              </span>
              <div className="image-142">
                <div className="object-142" />
              </div>
              <span className="grooming-benefits-142">
                Trong trường hợp chó mèo có lông dày và lông dài, việc tắm
                thường xuyên có thể giúp loại bỏ bụi bẩn và lông rụng. Bên cạnh
                đó còn giảm thiểu tình trạng tắc nghẽn lông, giữ cho lớp lông
                của chúng luôn bóng mượt.Việc thường xuyên sử dụng dịch vụ tắm
                chó mèo tại PetStore sẽ đem lại lợi ích thiết thực cho thú cưng
                của bạn. Tại PetStore thú cưng sẽ được tầm và chăm sóc theo đúng
                các quy trình tắm thú cưng chuyên nghiệp, bài bản và đầy đủ các
                bước: 
              </span>
              <span className="dog-cat-bath-142">tắm chó,mèo</span>
              <span className="blow-dry-brush-142">sấy và chải lông</span>
              <span className="ear-drying-142">lau khô tai</span>
            </div>
            <span className="ear-cleaning-142">vệ sinh tai</span>
            <span className="gland-expression-142">vắt tuyến hôi</span>
            <span className="nail-trimming-142">cạo bàn</span>
            <span className="flea-check-142">cắt móng</span>
            <span className="skin-check-142">
              Trong thời gian tầm của thú cưng, chúng tôi sẽ kiểm tra bọ chét,
              ve và sẽ thông báo cho bạn nếu thấy vẫn đề về da của chúng
            </span>
            <div className="vector-11-142" />
            <span className="price-list-142">bảng giá tắm cho chó mèo</span>
            <div className="flex-row-bd-142">
              <div className="image-12-142">
                <div className="vector-13-142" />
              </div>
              <div className="image-14-142" />
              <span className="bang-gia-142">bảng giá</span>
              <span className="gia-tam-cho-meo-duoi-kg-142">
                giá tắm chó mèo dưới 3kg
              </span>
              <span className="price-range-142">30.000 - 60.000 VND</span>
              <span className="gia-tam-cho-meo-kg-kg-142">
                giá tắm chó mèo 3kg - 5kg
              </span>
              <span className="price-range-15-142">60.000 - 90.000 VND</span>
            </div>
            <div className="flex-row-a-142">
              <div className="image-16-142">
                <div className="vector-17-142" />
              </div>
              <div className="image-18-142" />
              <span className="gia-tam-cho-meo-kg-kg-19-142">
                giá tắm chó mèo 6kg - 10kg
              </span>
              <span className="price-range-1a-142">90.000 - 120.000 VND</span>
              <span className="gia-tam-cho-kg-kg-142">
                giá tắm chó 11kg - 20kg
              </span>
              <span className="price-range-1b-142">120.000 - 150.000 VND</span>
              <span className="gia-tam-cho-kg-kg-1c-142">
                giá tắm chó 20kg - 30kg
              </span>
            </div>
            <span className="price-range-1d-142">150.000 - 300.000 VND</span>
            <span className="gia-tam-cho-tren-kg-142">
              giá tắm chó trên 30kg
            </span>
            <span className="price-range-1e-142">360.000 VND trở lên</span>
            <div className="rectangle-1f-142">
              <Link to="/Spa_Booking">
                <span className="hotline-142"> Đặt lịch ngay</span>
              </Link>
            </div>
            <span className="luu-y-tam-142">
              lưu ý khi sử dụng dịch vụ tắm cho chó mèo tại petStore
            </span>
            <div className="flex-row-b-142">
              <div className="image-21-142" />
              <span className="mang-dao-day-142">
                Mang theo dây xích cho chó mèo khi đưa đến tắm
              </span>
              <span className="tiem-phong-day-du-142">
                Chó mèo phải được tiêm phòng đầy đủ mới mang đến tắm.
              </span>
              <span className="an-uong-truoc-tam-142">
                Không cho chó mèo ăn quá no hay vận động nhiều trước khi đến tắm
                để đảm bảo sức khỏe.
              </span>
              <span className="an-uong-truoc-tam-22-142">
                Không cho chó mèo ăn quá no hay vận động nhiều trước khi đến tắm
                để đảm bảo sức khỏe.
              </span>
              <span className="dau-hieu-benh-142">
                Nếu thú cưng của bạn có dấu hiệu bệnh như ho, nhày mũi, tiêu
                chảy hoặc bất kỳ triệu chứng bất thường về sức khỏe vui lòng
                không tẩm cho chúng.
              </span>
              <span className="thoi-gian-tam-142">
                quý khách vui lòng đưa chó mèo đến tắm trong khoảng thời gian từ
                8h - 19h30
              </span>
              <span className="don-ve-trong-ngay-142">
                Thú cưng (chó, mèo) mang tới sử dụng dịch vụ phải đón về trong
                ngày, shop petStore không chịu bất cứ trách nhiệm nào nếu khách
                hàng không đón thú cưng về trong ngày (muộn nhất là 20h của ngày
                sử dụng dịch vụ).
              </span>
            </div>
            <div className="rectangle-23-142">
              <span className="lien-he-lich-24-142">
                liên hệ lịch tiêm ngay cho petStore chúng tôi
              </span>
              <span className="lien-he-lich-25-142">
                liên hệ lịch tiêm ngay cho petStore chúng tôi
              </span>
              <span className="hotline-26-142">hotline: 0336343299</span>
              <span className="hotline-27-142">hotline: 0336343299</span>
            </div>
          </div>
          <div className="inner-plugin-iframe-142" />
          <div className="inner-plugin-iframe-28-142" />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default BathService;
