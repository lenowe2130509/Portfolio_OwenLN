(function() {
    function init() {
        const teamMembers = [
            { name: "Luffy", role: "Founder" },
            { name: "Monkey D. Luffy", role: "Creative Director" },
            { name: "Luffy chan", role: "Lead Developer" },
            { name: "Lucy", role: "UX Designer" },
            { name: "Luffy kun", role: "Marketing Manager" },
            { name: "Monkey chan", role: "Product Manager" }
        ];

        const teamSection = document.getElementById('team');
        if (!teamSection) return;

        const cards = Array.from(teamSection.querySelectorAll(".card"));
        const dots = Array.from(teamSection.querySelectorAll(".dot"));
        const memberName = teamSection.querySelector(".member-name");
        const memberRole = teamSection.querySelector(".member-role");
        const upArrows = Array.from(teamSection.querySelectorAll(".nav-arrow.up"));
        const downArrows = Array.from(teamSection.querySelectorAll(".nav-arrow.down"));

        if (cards.length === 0) return;

        let currentIndex = 0;
        let isAnimating = false;

        function updateCarousel(newIndex) {
            if (isAnimating) return;
            isAnimating = true;

            currentIndex = ((newIndex % cards.length) + cards.length) % cards.length;

            cards.forEach((card, i) => {
                const offset = (i - currentIndex + cards.length) % cards.length;
                card.classList.remove("center", "up-1", "up-2", "down-1", "down-2", "hidden");

                if (offset === 0) card.classList.add("center");
                else if (offset === 1) card.classList.add("down-1");
                else if (offset === 2) card.classList.add("down-2");
                else if (offset === cards.length - 1) card.classList.add("up-1");
                else if (offset === cards.length - 2) card.classList.add("up-2");
                else card.classList.add("hidden");
            });

            dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));

            // Update member info with fade
            if (memberName) memberName.style.opacity = "0";
            if (memberRole) memberRole.style.opacity = "0";

            setTimeout(() => {
                if (memberName) {
                    memberName.textContent = teamMembers[currentIndex].name;
                    memberName.style.opacity = "1";
                }
                if (memberRole) {
                    memberRole.textContent = teamMembers[currentIndex].role;
                    memberRole.style.opacity = "1";
                }
            }, 300);

            setTimeout(() => { isAnimating = false; }, 800);
        }

        // Event Listeners
        upArrows.forEach(arrow => {
            arrow.addEventListener("click", () => updateCarousel(currentIndex - 1));
        });

        downArrows.forEach(arrow => {
            arrow.addEventListener("click", () => updateCarousel(currentIndex + 1));
        });

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => updateCarousel(i));
        });

        cards.forEach((card, i) => {
            card.addEventListener("click", () => updateCarousel(i));
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp") updateCarousel(currentIndex - 1);
            else if (e.key === "ArrowDown") updateCarousel(currentIndex + 1);
        });

        // Touch swipe
        let touchStartY = 0;
        teamSection.addEventListener("touchstart", (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        teamSection.addEventListener("touchend", (e) => {
            const touchEndY = e.changedTouches[0].screenY;
            const diff = touchStartY - touchEndY;
            const swipeThreshold = 50;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) updateCarousel(currentIndex + 1);
                else updateCarousel(currentIndex - 1);
            }
        });

        // Initial setup
        updateCarousel(0);
    }

    // Initialize on DOM ready or immediately if already loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();