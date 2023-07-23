import React from 'react'
// core components
import { Grid, 
  // Typography, IconButton
} from '@material-ui/core';
//components
import Banner from '../../../components/common/Banner';
import SectionContent from '../../../components/common/SectionContent'
import DoctorsImage from '../../../assets/imgs/international-student-medical-insurance-hospital-canada.jpg'

// banner Title
const bannerTitle = ['프리미엄 캐나다 유학생보험 에 가입하세요']
// Breadcrumbs
const links = [
  {

      to: '/',
      name: 'Home'
  },
  {
 
      to: '/travel-insurance/student',
      name: 'Student and Companion Plan'
  },  
]  

export default function Blog() { 
  return (
    <>
     <Banner title = {bannerTitle} links={links} quote_url="/travel-insurance/quote/trip-info"/>
     <Grid container>
        <Grid item container>
          <Grid item container style={{ margin:'5vh 0'}} >
              <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
              <SectionContent
                label="TravelInsurace.WhyNeed.Student.label"
                detail="캐나다로 유학을 계획중이신 분들, 이미 캐나다에 거주 중이신 유학생 분들과 동반 가족 분들이 모두 함께 혜택을 누릴 수 있는 프리미엄 캐나다 유학생보험 을 소개 합니다."
              />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="어떤 경우에 보장 받을 수 있나요?​"
              detail="캐나다 유학생 보험은 크게는 여행자 보험 카테고리에 속해있습니다. 따라서, 여행자 보험의 보장 전제를 따르는데요. 예기치 못하게 아파서 병원에 가는 경우 지정된 보장한도까지의 의료비, 비의료비를 보장 받으실 수 있습니다.
              쉽게 생각해서, 병원에 가기 위해 보험을 드는경우에는 보장이 거절될 확률이 매우 높구요. (이런 경우, 보험사에서 심사를 매우 까다롭게 진행하며, 만일 이런 의도가 적발됬을시 보장거절 뿐만이 아니라 캐나다에서 법적으로도 불이익을 받으실 수 있습니다)
              ​병원에 갈 예정이 없을때 만약을 대비해서 드는 경우 보험기간동안 병원에 가시면 보장 해 주는 보험입니다."
            />
            <Grid item container align='center'>
              <Grid item xs={12}>
              <img
                src={DoctorsImage}
                alt="프리미엄 캐나다 유학생보험"
                // className={classes.image}
              />
              </Grid>
            </Grid>
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="20억원 보장 한도의 의미​"
              detail="현지 프리미엄 캐나다 유학생보험 의 경우 캐나다 현지 의료시스템에 최적화된 혜택을 제공합니다. 즉, 의료비 보장 또한 캐나다 의료비를 기준으로 책정되었기 때문에 어떤 치료를 받았을 때, 턱없이 적은 보장금액으로 걱정 하실 필요가 없습니다.
              오늘 소개할 보험의 경우 TuGo 라는 캐나다 보험사로 대략 60여년 정도의 기업 역사를 이어가고 있습니다.        
              캐나다 전역의 공립, 사립학교, 대형항공사, 금융기관과 협력하여 그들에게 여행자보험을 제공 하고 있습니다."
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="큰 청구 케이스도 보장 가능한 탄탄한 회사​"
              detail="이에 걸맞게 유학생 보험의 경우 비교불가한 넉넉한 보장금액인 $2M (CAN) 대략 한화 20억 으로 책정 하였습니다. 이 말은 즉, 아파서 병원에 가시면 최대 20억 한도까지 보장을 받으실 수 있다는 말입니다.
              보험사에서 원하는 만큼의 보장금액을 마음대로 책정 할 수 없으며, 이정도의 보장금액을 책정하려면 그만큼의 자금을 회사에서 가지고 있어야 합니다. 캐네디언 여행자 보험의 보장금액의 경우 100억원으로 책정이 되어 있는데요. 이는 큰 청구 케이스가 생기더라도 충분히 보장 해 줄 수 있는 탄탄한 회사라는 것입니다."
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="워크인클리닉 의사 진료비용 보장​"
              detail="워크인클리닉에 가셔서 의사에게 진료를 받는 경우 보통 $60~$100 를 지불 해야 합니다. 투고 유학생 보험으로는 이 진료비를 한화 약 20억 한도 내로 보장 받으실 수 있습니다."
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="응급실 방문 의료비용 보장"
              detail="배가 심하게 아프거나, 사고가 났거나, 고열로 도저히 워크인클리닉 방문만으로 해결이 안될 것 같이 심하게 아픈 경우 응급실에 방문 하시면 되는데요.
              일단 응급실에 들어가셔서 환자 등록만 하셔도 기본$600~$1,000 을 지불 하셔야 합니다. 그리고 의사를 보는경우 일반 Physician 의 경우 $250~$400, 전문의를 추가로 보는 경우 각각 $300~$500 이상 따로 지불 하셔야 하고요.
              입원을 하시거나, 수술을 하시게 되면 최소 몇천만원은 쉽게 깨집니다. 예를 들어, 맹장수술: 2500만원~4000만원+ 입원비 따로 로 총 의료비가 흔한 맹장수술의 경우에도 5~6000만원은 우습게 청구 되고 있습니다.
              최근 한 고객분은 간단한 무릎염증수술을 당일에 받고 바로 병원을 나오셨는데요. 총 의료비가 거의 3000만원이 청구 되었습니다."
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="각종 물리치료 보장 $1,000/1년 한도​"
              detail="캐나다에서 카이로프랙터, 피지오테라피, 한의원 침술, 자연요법, 접골사, 언어치료사 와 같은 물리치료의 경우 영주권,시민권자 에게도 무료가 아닙니다. 이런 치료는 준의료 치료에 속해, 개인 사비로 모두 부담하여야 하며,
              현지인의 경우 보통 개인 건강 보험 또는 회사 복지 혜택을 통해 보장을 받고 있습니다.           
              외국인의 경우에도 동일하게 사비로 전액을 부담하여야 하는데요. 오늘 소개해드리고 있는 유학생 보험에 가입하시면 보장혜택으로 $1,000 (1년 연속 기간동안) 까지 각각 전문의사에 대해 누리실 수 있습니다. (카이로프랙터 $1,000 피지오테라피 $1,000 침술 $1,000 등)"
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="처방약 30일 분까지 보장​"
              detail="캐나다에서 영주권자의 경우에도 처방약은 본인 사비로 부담해야 합니다. 약값이 생각보다 부담이 되는 경우가 많은데요. $100 은 쉽게 나오고 있습니다.
              프리미엄 캐나다 유학생보험 인 투고 유학생보험은 30일분까지의 처방약을 한도 제한 없이 보장 해 주고 있습니다.             
              그 외, 나열할 수 없을 만큼 많은 보장혜택을 제공 하고 있습니다. 자세한 보장혜택을 보시려면 아래 버튼을 클릭하고 한국어 브로셔를 확인하세요:"
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="누가 가입 할 수 있나요?​"
              detail="캐나다 내에서 학교, 어학원에 풀타임으로 재학 중이신 만 69세 이하의 학생과 함께 거주중인 만 59세 이하의 동반가족 (부모,자녀) 이라면 가입이 가능합니다.
              ​학생비자를 가지고 있지 않아도 상관 없어요. 즉 워킹홀리데이를 와서 어학원을 풀타임으로 다닌다면? 가입이 가능합니다.         
              ​유학생 보험 중 유일하게 동반가족들도 함께 저렴한 보험료로 큰 보장혜택을 누릴 수 있습니다. 만일 유학생 자녀의 부모님이 일반 방문자보험에 가입 하시면 보장금액은 현저히 낮아지고, 보험료는 최소 2배 이상을 지불 하셔야 합니다."
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="청구는 어렵지 않을까요?​"
              detail="투고 유학생 보험 청구는 어렵지 않습니다. 현재는 모두 온라인으로 청구를 진행 중인데요. 다만, 익숙하지 않아서 서류미비, 부족한 정보 제공 등과 같은 이유로 지연이 되는 경우가 있습니다.
              캐나다 타지생활에 여러가지 챙겨야 할 일이 많은데 보험 청구까지 신경써야 한다면, 당연히 실수가 생길 수밖에 없는데요. 이러한 고객분들의 고충에 함께 고민하고 저희는 케어웰 이라는 회사의 청구 대행 서비스를 합리적인 비용으로 소개를 시켜드리고 있습니다.       
              케어웰 담당자분의 말에 따르면, 보험약관에 의해 보장받을 수 있는 청구 케이스의 경우 케어웰이 담당한 청구 건수의 100% 모두 보장을 받고 있다고 합니다."
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <span style={{display:'none'}}>프리미엄 캐나다유학생보험</span>
            <SectionContent
              label="가입은 어떻게 하나요?​"
              detail="아래 버튼을 클릭하시고 가입신청서를 작성해주시면, 저희 담당자가 신청서 검토 후 보험사에 가입진행을 합니다. 보험사에서 가입이 승인되면 즉시 이메일로 증권을 발부 받으실 수 있습니다."
            />
          </Grid>
          <Grid item container style={{ margin:'5vh 0' }}>
            <SectionContent
              label="스톤웰의 존재 이유​"
              detail="저희 스톤웰은 지난 26년간 여행자 보험 고객 (한인,캐네디언) 16만과 함께 성장하고 있는 탄탄한 기업입니다. 고객 개개인의 상황에 맞게 맞춤형 보험설계를 제공 하며, 가입 이후 보험만료까지 고객의 마음 편한 캐나다 생활을 위해 힘쓰고 있습니다.
              여행자 보험 전문 담당 팀이 실시간으로 캐나다 내 모든 보험사의 보험상품을 비교분석하고 있기 때문에, 고객이 스스로 모든 보험사의 플랜을 비교하는 수고로움을 덜어드립니다.           
              보험의 필요성을 알려 드리고 고객 개개인의 상황에 맞춰 낯선 캐나다 현지 보험을 소개 해 드리고 있습니다."
            />
          </Grid>

        </Grid>
     </Grid>
    </>
  )
}

