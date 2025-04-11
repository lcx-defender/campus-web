<template>
  <div class="about-section">
    <h2>关于我们</h2>
    <p>
      在数字化时代，高校迎新工作正面临效率低、流程繁琐、信息管理复杂等挑战。为此，我们设计并开发了一款基于大模型与Redis技术的大学新生智慧迎新平台，旨在通过智能化手段优化迎新流程，提升新生入学体验和学校管理效率。
    </p>
    <h3>项目亮点</h3>
    <ul>
      <li>
        <strong>智能化迎新服务：</strong> 平台采用大语言模型（LLM）技术，提供智能问答服务，实时解答新生在入学过程中遇到的各种问题，如宿舍分配、课程安排、校园设施等。
      </li>
      <li>
        <strong>高效数据处理：</strong> 使用Redis作为高性能数据库，支持高并发场景下的数据读写需求，确保迎新流程的高效流畅。
      </li>
      <li>
        <strong>多样化迎新服务方式：</strong> 支持线上信息采集、移动App报到、人脸识别身份验证等多种服务方式，减少排队等待时间，提升入学体验。
      </li>
      <li>
        <strong>实时数据监控与分析：</strong> 提供实时数据监控功能，帮助学校合理安排资源。
      </li>
      <li>
        <strong>安全与隐私保护：</strong> 对新生的个人信息进行加密处理，确保数据传输和存储的安全性。
      </li>
    </ul>
    <h3>技术架构</h3>
    <p>
      平台采用Vue 3和UniApp技术栈，支持Web端、移动端和小程序等多种平台；后端基于Spring Boot和MyBatis Plus框架，结合MySQL和Redis，提供高效、安全的迎新服务。
    </p>
    <h3>未来展望</h3>
    <p>
      本平台不仅优化了传统迎新工作模式，还为智慧校园建设提供了有力支持。未来将进一步接入教务管理系统、学生工作管理系统等，助力高校实现全面的智能化管理。
    </p>
  </div>
</template>

<style scoped>
.about-section {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
}

.about-section h3 {
  font-size: 20px;
  color: #4facfe;
  margin-top: 20px;
}

.about-section p {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
}

.about-section ul {
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 10px;
}

.about-section ul li {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.about-section ul li strong {
  color: #333;
}
</style>