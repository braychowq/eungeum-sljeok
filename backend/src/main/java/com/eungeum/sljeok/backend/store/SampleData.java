package com.eungeum.sljeok.backend.store;

import com.eungeum.sljeok.backend.model.CommunityPost;
import com.eungeum.sljeok.backend.model.Studio;
import java.util.List;

public final class SampleData {
  private SampleData() {}

  public static List<Studio> studios() {
    return List.of(
        new Studio(
            "casa-gemma",
            "서촌",
            "Casa Gemma",
            "₩540,000",
            "장인의 수공구와 쇼룸을 함께 쓰는 한옥형 작업 공간입니다.",
            List.of("수공구", "쇼룸", "정숙 구역"),
            "https://lh3.googleusercontent.com/aida-public/AB6AXuChTI_mK8WffSw2aGsFzBDTJrDiq7CgFdPHDAQfcL-ISafOPgzDiv6zL9DpsVpgxg8DSLjH38Ed1PHX1Uf-8dzTiTFr7YIWfrIbI5FfhpyBAFIFWLBW4cNyjpUH3yg3KywkiwuOU0YMxHhSMVnXSwYSh8jZvTjD4Y6ZUvOgf2eH26nqwI-4ZhAgYsQp-uko2L0uq3svfvfyRuTVulS_8g_sozZkbxEppcxrXZCT9c2WSucNtwFuZcx1VOJq-t5Ae0IpK1g74xvHdJQ"
        ),
        new Studio(
            "forge-quiet",
            "성수",
            "Forge & Quiet",
            "₩690,000",
            "금속 작업을 위한 대형 설비와 산업용 환기 시설을 갖춘 공간입니다.",
            List.of("롤링 밀", "레이저 용접기", "24시간"),
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCq4mpQF5qE6z9i5y3xbnMXQ-0ssW4dJ2km2r6CV0m6sM0KHE11lP1wYdcy4YvnmBEhijv2o4oGykHj2B3PS5JmEOR4nPzj9h8dPjRZ3YtWsGx9q6ha2iZ6So5iFl8gIo1lYbRk4g_AWz4jA8TLFaT0g5w5QQQllNGJq8h2q1M7HaGWHdtnbXK_XfnbbZV8Q_2n6H3JoWrNh8Y0jYw5Q9MZsz1V5gr6dJtr9clxGxZ8x7sF9bR6s4o9twD0_85heB5J49anbVozqN5q"
        )
    );
  }

  public static List<CommunityPost> posts() {
    return List.of(
        new CommunityPost(
            "journal-1",
            "저널",
            "한국 전통 매듭의 기원을 찾아서",
            "현대 주얼리 제작자들이 세대를 잇기 위해 매듭 기술을 현대적인 금속 공예에 어떻게 통합하고 있는지 알아봅니다.",
            "2024년 3월 12일",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDvdVBYxRx2GEcdVrlHGmxCv9YY7Zn1dqhPg0WtZ10Pz74i97uq3A2hqM0fEiDMif3LJtRn297a_CiHRPLoE95xqIquvKonn0CnEK_ULyOWqoOL_fYxsA6l81K57W4ltPiiot36UkINEmBxiplMSIwoabCPlP1hdPrPtuHMWdJ-QEi-1FmMzXoGPXduVMYpYWpUyM0gQq83Z4nGzvyTr2M8J6k3TsnTZpUwe4dIpZpZMVpYWoljO4_42j89ONL0oiL2yH5i3GJxS9k"
        ),
        new CommunityPost(
            "market-1",
            "마켓",
            "봄맞이 원석 경매: 큐레이션 셀렉션",
            "이번 주말 마켓에 출시될 희귀한 컷팅 스톤들을 미리 확인해보세요. 스튜디오 공유 회원 독점 공개입니다.",
            "2024년 3월 10일",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBx1bNrUlP1Dajx5o4-eLD-dtcTFchEGEjdD8u1N77PpmC4SwOAh-y9-QulLwMcbt8SpGS2odeusHx2faHfj0rEZXUbxls9Gv9B9ZEhkk2kycZvCo7axkllnM0oWmhQVFYj7AZxFcaWo4vzYRIoqkE7WZ6Gwn7vBYNdbxchpMdsrgaB1WYRdNO96CipmoT60VICxxcvKfXjBmaTq3Xrs_k30YherjEYxzYitwOQS8nYg5bhUjpdLcK1wnc4s27hdEMuOEcMR_4gWBQ"
        )
    );
  }
}
