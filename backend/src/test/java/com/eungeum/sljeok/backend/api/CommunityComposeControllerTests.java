package com.eungeum.sljeok.backend.api;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CommunityComposeController.class)
class CommunityComposeControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsComposeConfigForThreeCommunityFlows() throws Exception {
        mockMvc.perform(get("/api/community/compose-config"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.publishingSteps[0]").value("주제와 포맷을 고른다"))
                .andExpect(jsonPath("$.tabs", hasSize(3)))
                .andExpect(jsonPath("$.tabs[0].id").value("qna"))
                .andExpect(jsonPath("$.tabs[1].label").value("공유"))
                .andExpect(jsonPath("$.tabs[2].checklist[2].label").value("위치·연락처 같은 민감한 정보는 뺐나요?"));
    }
}
