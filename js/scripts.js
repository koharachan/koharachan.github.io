window.onload = function () {
  fetch("https://blog.meowhead.cn/rss.xml")
    .then((res) => res.text())
    .then((xmlStr) => new window.DOMParser().parseFromString(xmlStr, "text/xml"))
    .then((data) => {
      const items = data.querySelectorAll("item");
      const aboutSection = document.getElementById("about");
      const workSection = document.getElementById("work");

      // 创建新的 rss 容器
      const rssContainer = document.createElement("div");
      rssContainer.id = "rss-feed";
      rssContainer.innerHTML = `
        <h2>博客更新</h2>
        <span class="heading-underline"></span>
        <div class="rss-list">加载中...</div>
      `;

      // 插入到 about 和 work 中间
      aboutSection.parentNode.insertBefore(rssContainer, workSection);

      const container = rssContainer.querySelector(".rss-list");
      container.innerHTML = ""; // 清空加载中...

      items.forEach((item, index) => {
        if (index >= 10) return; // 限制前10条
        const title = item.querySelector("title")?.textContent?.trim() || "";
        const link = item.querySelector("link")?.textContent?.trim() || "#";
        const desc = item.querySelector("description")?.textContent?.replace(/<[^>]+>/g, "").trim() || "";
        const pubDate = new Date(item.querySelector("pubDate")?.textContent || "").toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

        const entry = document.createElement("div");
        entry.className = "rss-entry";
        entry.innerHTML = `
          <h3><a href="${link}" target="_blank" rel="noopener">${title}</a></h3>
          <p class="rss-time">${pubDate}</p>
          <p class="rss-desc"><a href="${link}" target="_blank" rel="noopener">${desc.substring(0, 100)}...</a></p>
        `;
        container.appendChild(entry);
      });
    })
    .catch((err) => {
      const rss = document.getElementById("rss-feed");
      if (rss) rss.querySelector(".rss-list").innerText = "无法加载博客更新 :(";
      console.error("RSS 加载失败：", err);
    });
};
