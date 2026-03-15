package com.eungeum.sljeok.backend.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/community")
public class CommunityComposeController {

    @GetMapping("/compose-config")
    public CommunityComposeResponse composeConfig() {
        return new CommunityComposeResponse(
                "2026-03-15",
                List.of(
                        "주제와 포맷을 고른다",
                        "핵심 맥락과 시도한 내용을 정리한다",
                        "신뢰 체크리스트를 확인한다",
                        "미리보기를 보고 게시 준비를 마친다"),
                List.of(
                        new CommunityComposeTabResponse(
                                "qna",
                                "Q&A",
                                "문제 상황과 조건값을 빠르게 정리해 답변 속도를 높이는 글 흐름",
                                List.of("납땜", "도금", "안전"),
                                List.of("문제 상황", "이미 시도한 것", "받고 싶은 답변"),
                                List.of(
                                        new CommunityComposeChecklistItemResponse(
                                                "재료와 규격을 적었나요?",
                                                "재료명, 두께, 공정 단계가 있어야 답변이 구체적입니다."),
                                        new CommunityComposeChecklistItemResponse(
                                                "이미 시도한 방법을 적었나요?",
                                                "중복 답변을 줄이고 다음 해결책으로 바로 넘어갈 수 있습니다."),
                                        new CommunityComposeChecklistItemResponse(
                                                "안전 조건을 함께 적었나요?",
                                                "화기, 약품, 환기 관련 맥락이 있으면 더 안전한 답변을 받습니다."))),
                        new CommunityComposeTabResponse(
                                "share",
                                "공유",
                                "다른 메이커가 바로 재사용할 수 있는 실무 자료와 운영 팁 흐름",
                                List.of("거래처", "체크리스트", "운영"),
                                List.of("자료 출처", "사용 시점", "보완 요청 포인트"),
                                List.of(
                                        new CommunityComposeChecklistItemResponse(
                                                "출처와 업데이트 시점을 적었나요?",
                                                "자료의 신뢰도를 판단하는 가장 빠른 기준입니다."),
                                        new CommunityComposeChecklistItemResponse(
                                                "누가 언제 쓰면 좋은지 적었나요?",
                                                "독자가 바로 자기 상황에 대입할 수 있어야 저장 가치가 생깁니다."),
                                        new CommunityComposeChecklistItemResponse(
                                                "추가 보완 요청 포인트를 남겼나요?",
                                                "댓글 참여와 공동 업데이트 흐름을 여는 장치입니다."))),
                        new CommunityComposeTabResponse(
                                "free",
                                "아무말",
                                "작업 근황과 시장 후기를 대화형으로 이어가는 가벼운 글 흐름",
                                List.of("작업근황", "플리마켓", "대화"),
                                List.of("오늘의 맥락", "이어질 질문", "민감 정보 제거"),
                                List.of(
                                        new CommunityComposeChecklistItemResponse(
                                                "오늘의 맥락을 적었나요?",
                                                "짧은 근황이어도 장소, 상황, 이유가 있으면 공감이 쉬워집니다."),
                                        new CommunityComposeChecklistItemResponse(
                                                "이어질 질문 한 줄을 넣었나요?",
                                                "댓글을 부르는 장치가 있으면 단순 일기에서 대화로 넘어갑니다."),
                                        new CommunityComposeChecklistItemResponse(
                                                "위치·연락처 같은 민감한 정보는 뺐나요?",
                                                "가벼운 글일수록 과한 정보 노출을 줄이는 것이 안전합니다.")))));
    }

    public record CommunityComposeResponse(
            String updatedAt,
            List<String> publishingSteps,
            List<CommunityComposeTabResponse> tabs) {
    }

    public record CommunityComposeTabResponse(
            String id,
            String label,
            String goal,
            List<String> suggestedTags,
            List<String> requiredBlocks,
            List<CommunityComposeChecklistItemResponse> checklist) {
    }

    public record CommunityComposeChecklistItemResponse(String label, String reason) {
    }
}
