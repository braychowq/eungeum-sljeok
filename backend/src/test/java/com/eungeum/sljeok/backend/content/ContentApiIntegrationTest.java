package com.eungeum.sljeok.backend.content;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@TestPropertySource(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:content-api-test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
      "auth.allowed-origins=http://127.0.0.1:3025,http://localhost:3025"
    })
class ContentApiIntegrationTest {
  private static final Pattern CONVERSATION_ID_PATTERN =
      Pattern.compile("\"detailPath\"\\s*:\\s*\"/messages/([^\"]+)\"");
  private static final Pattern COMMUNITY_SLUG_PATTERN =
      Pattern.compile("\"detailPath\"\\s*:\\s*\"/community/post/([^\"]+)\"");
  private static final Pattern STUDIO_SLUG_PATTERN =
      Pattern.compile("\"detailPath\"\\s*:\\s*\"/market/studio/([^\"]+)\"");
  private static final String TINY_PNG_DATA_URL =
      "data:image/png;base64,"
          + "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9sN0eJQAAAAASUVORK5CYII=";

  @Autowired private MockMvc mockMvc;

  @Test
  void communityCreateRequiresAuthentication() throws Exception {
    mockMvc
        .perform(
            post("/api/community/posts")
                .contentType(APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                .content(
                    """
                    {
                      "category": "free",
                      "title": "인증 없는 작성",
                      "body": "로그인 없이 쓰기 요청이 거부되는지 확인합니다."
                    }
                    """))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value("error"));
  }

  @Test
  void communityCreateRejectsForeignOrigin() throws Exception {
    Cookie sessionCookie = loginCookie("OriginTestUser");

    mockMvc
        .perform(
            post("/api/community/posts")
                .cookie(sessionCookie)
                .contentType(APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "https://evil.example")
                .content(
                    """
                    {
                      "category": "free",
                      "title": "외부 Origin 차단",
                      "body": "외부 Origin 요청을 차단하는지 확인합니다."
                    }
                    """))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("request_failed"));
  }

  @Test
  void communityCreateReturnsValidationErrors() throws Exception {
    Cookie sessionCookie = loginCookie("ValidationTestUser");

    mockMvc
        .perform(
            post("/api/community/posts")
                .cookie(sessionCookie)
                .contentType(APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                .content(
                    """
                    {
                      "category": "free",
                      "title": "가",
                      "body": "나"
                    }
                    """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("validation_failed"))
        .andExpect(jsonPath("$.fieldErrors.title").exists())
        .andExpect(jsonPath("$.fieldErrors.body").exists());
  }

  @Test
  void communityCreatePersistsUploadedImagesAndReturnsThemInDetail() throws Exception {
    Cookie sessionCookie = loginCookie("이미지게시글회원");

    MvcResult createResult =
        mockMvc
            .perform(
                post("/api/community/posts")
                    .cookie(sessionCookie)
                    .contentType(APPLICATION_JSON)
                    .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                    .content(
                        """
                        {
                          "category": "free",
                          "title": "이미지 포함 게시글",
                          "body": "업로드한 이미지를 실제로 저장하고 다시 돌려줘야 합니다.",
                          "imageDataUrls": ["%s"]
                        }
                        """
                            .formatted(TINY_PNG_DATA_URL)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.detailPath").exists())
            .andReturn();

    String slug =
        extractCommunitySlug(createResult.getResponse().getContentAsString(StandardCharsets.UTF_8));

    mockMvc
        .perform(get("/api/community/posts/{slug}", slug))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.imageUrls[0]").value(TINY_PNG_DATA_URL));
  }

  @Test
  void conversationCreateRequiresAuthentication() throws Exception {
    mockMvc
        .perform(
            post("/api/conversations")
                .contentType(APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                .content(
                    """
                    {
                      "workshopSlug": "silent-earth"
                    }
                    """))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value("error"));
  }

  @Test
  void authenticatedUserCanCreateConversationAndSendMessage() throws Exception {
    Cookie sessionCookie = loginCookie("문의회원");

    MvcResult conversationResult =
        mockMvc
            .perform(
                post("/api/conversations")
                    .cookie(sessionCookie)
                    .contentType(APPLICATION_JSON)
                    .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                    .content(
                        """
                        {
                          "workshopSlug": "silent-earth"
                        }
                        """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.detailPath").exists())
            .andReturn();

    String conversationId =
        extractConversationId(
            conversationResult.getResponse().getContentAsString(StandardCharsets.UTF_8));

    mockMvc
        .perform(
            post("/api/messages")
                .cookie(sessionCookie)
                .contentType(APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                .content(
                    """
                    {
                      "conversationId": "%s",
                      "content": "안녕하세요, 작업 동선이 궁금해요."
                    }
                    """
                        .formatted(conversationId)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.content").value("안녕하세요, 작업 동선이 궁금해요."));

    mockMvc
        .perform(get("/api/conversations/" + conversationId + "/messages").cookie(sessionCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.messages[0].content").value("안녕하세요, 작업 동선이 궁금해요."));
  }

  @Test
  void conversationUnreadCountChangesAfterOwnerReadsMessages() throws Exception {
    Cookie guestCookie = loginCookie("읽음체크회원");
    Cookie ownerCookie = loginCookie("은금슬쩍 큐레이션", "user-seed-curation-host");

    MvcResult conversationResult =
        mockMvc
            .perform(
                post("/api/conversations")
                    .cookie(guestCookie)
                    .contentType(APPLICATION_JSON)
                    .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                    .content(
                        """
                        {
                          "workshopSlug": "silent-earth"
                        }
                        """))
            .andExpect(status().isOk())
            .andReturn();

    String conversationId = extractConversationId(conversationResult.getResponse().getContentAsString());

    mockMvc
        .perform(
            post("/api/messages")
                .cookie(guestCookie)
                .contentType(APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                .content(
                    """
                    {
                      "conversationId": "%s",
                      "content": "호스트가 읽기 전 unread 수를 확인합니다."
                    }
                    """
                        .formatted(conversationId)))
        .andExpect(status().isOk());

    mockMvc
        .perform(get("/api/conversations").cookie(ownerCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.totalUnreadCount").value(1))
        .andExpect(jsonPath("$.data.items[0].unreadCount").value(1));

    mockMvc
        .perform(get("/api/conversations/" + conversationId + "/messages").cookie(ownerCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.messages[0].content").value("호스트가 읽기 전 unread 수를 확인합니다."));

    mockMvc
        .perform(get("/api/conversations/unread-count").cookie(ownerCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.count").value(0));
  }

  @Test
  void studioCreatePersistsUploadedImagesAndReturnsThemInDetail() throws Exception {
    Cookie sessionCookie = loginCookie("이미지공방회원");

    MvcResult createResult =
        mockMvc
            .perform(
                post("/api/studios")
                    .cookie(sessionCookie)
                    .contentType(APPLICATION_JSON)
                    .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                    .content(
                        """
                        {
                          "name": "이미지 공방",
                          "location": "서울 종로구 테스트길 10",
                          "description": "이미지를 실제로 저장하는지 확인하는 공방 설명입니다.",
                          "price": 120000,
                          "contact": "010-0000-0000",
                          "category": "주얼리 공방",
                          "capacity": 4,
                          "amenities": ["연마 선반"],
                          "imageDataUrls": ["%s"]
                        }
                        """
                            .formatted(TINY_PNG_DATA_URL)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.detailPath").exists())
            .andReturn();

    String slug =
        extractStudioSlug(createResult.getResponse().getContentAsString(StandardCharsets.UTF_8));

    mockMvc
        .perform(get("/api/studios/{slug}", slug).cookie(sessionCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.imageUrls[0]").value(TINY_PNG_DATA_URL));
  }

  @Test
  void messageCreateReturnsValidationErrors() throws Exception {
    Cookie sessionCookie = loginCookie("메시지검증회원");

    MvcResult conversationResult =
        mockMvc
            .perform(
                post("/api/conversations")
                    .cookie(sessionCookie)
                    .contentType(APPLICATION_JSON)
                    .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                    .content(
                        """
                        {
                          "workshopSlug": "maison-de-lartiste"
                        }
                        """))
            .andExpect(status().isOk())
            .andReturn();

    String conversationId =
        extractConversationId(
            conversationResult.getResponse().getContentAsString(StandardCharsets.UTF_8));

    mockMvc
        .perform(
            post("/api/messages")
                .cookie(sessionCookie)
                .contentType(APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "http://127.0.0.1:3025")
                .content(
                    """
                    {
                      "conversationId": "%s",
                      "content": ""
                    }
                    """
                        .formatted(conversationId)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.fieldErrors.content").exists());
  }

  private Cookie loginCookie(String displayName) throws Exception {
    return loginCookie(displayName, null);
  }

  private Cookie loginCookie(String displayName, String userId) throws Exception {
    MvcResult loginResult =
        mockMvc
            .perform(
                post("/api/test-auth/login")
                    .contentType(APPLICATION_JSON)
                    .content(
                        """
                        {
                          "displayName": "%s",
                          "userId": %s
                        }
                        """
                            .formatted(
                                displayName,
                                userId == null ? "null" : "\"" + userId + "\"")))
            .andExpect(status().isOk())
            .andReturn();

    Cookie[] cookies = loginResult.getResponse().getCookies();
    if (cookies == null || cookies.length == 0) {
      throw new IllegalStateException("테스트 로그인 쿠키가 발급되지 않았습니다.");
    }
    return cookies[0];
  }

  private String extractConversationId(String responseBody) {
    Matcher matcher = CONVERSATION_ID_PATTERN.matcher(responseBody);
    if (!matcher.find()) {
      throw new IllegalStateException("대화방 ID를 찾을 수 없습니다.");
    }
    return matcher.group(1);
  }

  private String extractCommunitySlug(String responseBody) {
    Matcher matcher = COMMUNITY_SLUG_PATTERN.matcher(responseBody);
    if (!matcher.find()) {
      throw new IllegalStateException("게시글 슬러그를 찾을 수 없습니다.");
    }
    return matcher.group(1);
  }

  private String extractStudioSlug(String responseBody) {
    Matcher matcher = STUDIO_SLUG_PATTERN.matcher(responseBody);
    if (!matcher.find()) {
      throw new IllegalStateException("공방 슬러그를 찾을 수 없습니다.");
    }
    return matcher.group(1);
  }
}
