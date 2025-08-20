const CHART_CONFIG = {
  BASE_SHEET_URL:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRl1PboH_xomFg7PbmxpN7V8fx3cnCYQrCnInLCeLxQDpkyYFtZN1YEffn_ceZaTkl-jRkkqonA2MRX/pub?output=csv&gid=",
  CORS_PROXY: "https://corsproxy.io/?",
  API_BASE_URL: "https://ri.meliuz.com.br/Consulta.aspx",
};

const ChartContainerManager = {
  minWidths: {
    mobile: 350,
    tablet: 600,
    desktop: 700,
  },

  breakpoints: {
    mobile: 768,
    // tablet: 1024
  },

  chartsNeedingWrapper: [],

  init() {
    setTimeout(() => {
      this.setupChartWrappers();
    }, 100);
    this.setupResizeListener();
  },

  setupChartWrappers() {
    const chartElements = document.querySelectorAll('[id^="chart"]');
    chartElements.forEach((chartElement) => {
      this.createChartWrapper(chartElement.id);
    });
  },

  createChartWrapper(chartKey) {
    const chartElement = document.getElementById(chartKey);
    if (!chartElement) return;

    if (chartElement.parentElement.classList.contains("chart-scroll-wrapper")) {
      return;
    }

    const windowWidth = window.innerWidth;

    if (windowWidth > this.breakpoints.tablet) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "chart-scroll-wrapper";
    wrapper.style.cssText = `
      width: 100%;
      height: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      position: relative;
    `;

    chartElement.parentNode.insertBefore(wrapper, chartElement);
    wrapper.appendChild(chartElement);

    this.updateChartWidth(chartKey);
  },

  updateChartWidth(chartKey) {
    const chartElement = document.getElementById(chartKey);
    if (!chartElement) return;

    const wrapper = chartElement.closest(".chart-scroll-wrapper");
    const windowWidth = window.innerWidth;

    if (windowWidth > this.breakpoints.tablet) {
      if (wrapper) {
        chartElement.style.minWidth = "";
        chartElement.style.width = "";
        wrapper.parentNode.insertBefore(chartElement, wrapper);
        wrapper.remove();
      }
      return;
    }

    if (!wrapper) {
      this.createChartWrapper(chartKey);
      return;
    }

    let minWidth;

    if (windowWidth <= this.breakpoints.mobile) {
      minWidth = this.minWidths.mobile;
    } else if (windowWidth <= this.breakpoints.tablet) {
      minWidth = this.minWidths.tablet;
    }

    chartElement.style.minWidth = `${minWidth}px`;
    chartElement.style.width = `${minWidth}px`;
  },

  setupResizeListener() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const chartElements = document.querySelectorAll('[id^="chart"]');
        chartElements.forEach((chartElement) => {
          this.updateChartWidth(chartElement.id);
        });
      }, 250);
    });
  },
};

const LanguageManager = {
  currentLanguage: "pt-BR",
  detectedFromPathname: false,

  formatConfigs: {
    "pt-BR": {
      locale: "pt-BR",
      numberFormat: {
        decimal: ",",
        thousands: ".",
        currency: "R$",
        percent: "%",
        bitcoin: "₿",
        dollar: "$",
      },
      dateFormat: {
        short: "dd/MM/yyyy",
        long: "dd/MM/yyyy HH:mm",
        monthYear: "MMM/yy",
      },
      monthNames: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
    },
    "en-US": {
      locale: "en-US",
      numberFormat: {
        decimal: ".",
        thousands: ",",
        currency: "$",
        percent: "%",
        bitcoin: "₿",
        dollar: "$",
      },
      dateFormat: {
        short: "MM/dd/yyyy",
        long: "MM/dd/yyyy HH:mm",
        monthYear: "MMM/yy",
      },
      monthNames: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  },

  init() {
    this.detectCurrentLanguage();
    this.setupLanguageObserver();
    return this.currentLanguage;
  },

  detectCurrentLanguage() {
    const pathname = window.location.pathname.toLowerCase();

    // Home pages
    if (pathname.includes("home-en.html")) {
      this.currentLanguage = "en-US";
      this.detectedFromPathname = true;
      return this.currentLanguage;
    } else if (pathname.includes("home.html")) {
      this.currentLanguage = "pt-BR";
      this.detectedFromPathname = true;
      return this.currentLanguage;
    }

    if (pathname.includes("charts.html")) {
      this.currentLanguage = "en-US";
      this.detectedFromPathname = true;
      return this.currentLanguage;
    } else if (pathname.includes("graficos.html")) {
      this.currentLanguage = "pt-BR";
      this.detectedFromPathname = true;
      return this.currentLanguage;
    }

    const hidLinguagem = document.querySelector(".hidLinguagem");
    if (hidLinguagem) {
      const languageValue = hidLinguagem.value;
      this.currentLanguage = languageValue === "ptg" ? "pt-BR" : "en-US";
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const linguagem = urlParams.get("linguagem");
      if (linguagem === "en") {
        this.currentLanguage = "en-US";
      } else if (linguagem === "pt") {
        this.currentLanguage = "pt-BR";
      } else {
        this.currentLanguage = "pt-BR";
      }
    }

    if (!this.currentLanguage) {
      this.currentLanguage = "pt-BR";
    }

    return this.currentLanguage;
  },

  setupLanguageObserver() {
    const hidLinguagem = document.querySelector(".hidLinguagem");
    if (hidLinguagem) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "value"
          ) {
            const newLanguage =
              hidLinguagem.value === "ptg" ? "pt-BR" : "en-US";
            if (newLanguage !== this.currentLanguage) {
              this.currentLanguage = newLanguage;
              this.onLanguageChange();
            }
          }
        });
      });

      observer.observe(hidLinguagem, {
        attributes: true,
        attributeFilter: ["value"],
      });
    }

    let currentUrl = window.location.href;
    setInterval(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        const newLanguage = this.detectCurrentLanguage();
        if (newLanguage !== this.currentLanguage) {
          this.currentLanguage = newLanguage;
          this.onLanguageChange();
        }
      }
    }, 1000);

    window.addEventListener("popstate", () => {
      const newLanguage = this.detectCurrentLanguage();
      if (newLanguage !== this.currentLanguage) {
        this.currentLanguage = newLanguage;
        this.onLanguageChange();
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target.closest("a");
      if (
        target &&
        (target.href.includes("linguagem=pt") ||
          target.href.includes("linguagem=en"))
      ) {
        setTimeout(() => {
          const newLanguage = this.detectCurrentLanguage();
          if (newLanguage !== this.currentLanguage) {
            this.currentLanguage = newLanguage;
            this.onLanguageChange();
          }
        }, 100);
      }
    });
  },

  onLanguageChange() {
    applyLocaleConfigurations();

    chartData = {};
    apiSimpleData = {};

    Object.keys(chartInstances).forEach((chartKey) => {
      const chart = chartInstances[chartKey];
      if (chart && !chart.isDisposed()) {
        chart.dispose();
        delete chartInstances[chartKey];
      }
    });

    loadAllData();
  },

  getCurrentFormatConfig() {
    return (
      this.formatConfigs[this.currentLanguage] || this.formatConfigs["pt-BR"]
    );
  },

  formatNumber(value, options = {}) {
    const targetLocale = options.locale || this.currentLanguage;
    const config =
      this.formatConfigs[targetLocale] || this.getCurrentFormatConfig();

    let decimalsToUse = options.decimals || 2;
    if (options.forceDecimals === 0) {
      decimalsToUse = 0;
    }

    const {
      prefix = "",
      suffix = "",
      useGrouping = true,
      currency = null,
      percent = false,
      abbreviate = false,
    } = options;

    if (value === null || value === undefined || isNaN(value)) {
      return "-";
    }

    let numericValue = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(numericValue)) {
      return value.toString();
    }

    if (percent) {
      numericValue = numericValue * 100;
    }

    if (abbreviate && numericValue >= 1000000) {
      if (numericValue >= 1000000000) {
        const billions = numericValue / 1000000000;
        if (options.abbreviateType === "short") {
          const decimalSeparator = targetLocale === "pt-BR" ? "," : ".";
          return (
            prefix +
            billions.toFixed(1).replace(".", decimalSeparator) +
            "B" +
            suffix
          );
        } else if (
          options.abbreviateType === "custom" &&
          options.customSuffix
        ) {
          const decimalSeparator = targetLocale === "pt-BR" ? "," : ".";
          return (
            prefix +
            billions.toFixed(1).replace(".", decimalSeparator) +
            " " +
            options.customSuffix +
            suffix
          );
        } else {
          const decimalSeparator = targetLocale === "pt-BR" ? "," : ".";
          const suffixText = targetLocale === "pt-BR" ? " bilhões" : " billion";
          return (
            prefix +
            billions.toFixed(1).replace(".", decimalSeparator) +
            suffixText +
            suffix
          );
        }
      } else {
        const millions = numericValue / 1000000;
        if (options.abbreviateType === "short") {
          const decimalSeparator = targetLocale === "pt-BR" ? "," : ".";
          return (
            prefix +
            millions.toFixed(1).replace(".", decimalSeparator) +
            "M" +
            suffix
          );
        } else if (
          options.abbreviateType === "custom" &&
          options.customSuffix
        ) {
          const decimalSeparator = targetLocale === "pt-BR" ? "," : ".";
          return (
            prefix +
            millions.toFixed(1).replace(".", decimalSeparator) +
            " " +
            options.customSuffix +
            suffix
          );
        } else {
          const decimalSeparator = targetLocale === "pt-BR" ? "," : ".";
          const suffixText = targetLocale === "pt-BR" ? " milhões" : " million";
          return (
            prefix +
            millions.toFixed(1).replace(".", decimalSeparator) +
            suffixText +
            suffix
          );
        }
      }
    }

    let formattedValue;
    if (targetLocale === "pt-BR") {
      if (decimalsToUse === 0) {
        const roundedValue = Math.round(numericValue);
        if (useGrouping && roundedValue >= 1000) {
          formattedValue = roundedValue
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else {
          formattedValue = roundedValue.toString();
        }
      } else {
        const fixedValue = numericValue.toFixed(decimalsToUse);
        if (useGrouping && numericValue >= 1000) {
          const parts = fixedValue.split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          formattedValue = parts.join(",");
        } else {
          formattedValue = fixedValue.replace(".", ",");
        }
      }
    } else {
      if (decimalsToUse === 0) {
        const roundedValue = Math.round(numericValue);
        if (useGrouping && roundedValue >= 1000) {
          formattedValue = roundedValue.toLocaleString("en-US");
        } else {
          formattedValue = roundedValue.toString();
        }
      } else {
        if (useGrouping && numericValue >= 1000) {
          formattedValue = numericValue.toLocaleString("en-US", {
            minimumFractionDigits: decimalsToUse,
            maximumFractionDigits: decimalsToUse,
            useGrouping: true,
          });
        } else {
          formattedValue = numericValue.toFixed(decimalsToUse);
        }
      }
    }

    let finalPrefix = prefix;
    let finalSuffix = suffix;

    if (currency) {
      switch (currency) {
        case "bitcoin":
          finalPrefix = config.numberFormat.bitcoin + " ";
          break;
        case "dollar":
          finalPrefix = config.numberFormat.dollar + " ";
          break;
        case "currency":
          finalPrefix = config.numberFormat.currency + " ";
          break;
        case "percent":
          finalSuffix = " " + config.numberFormat.percent;
          break;
      }
    }

    return `${finalPrefix}${formattedValue}${finalSuffix}`;
  },

  formatDate(date, format = "short") {
    const config = this.getCurrentFormatConfig();
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return date.toString();
    }

    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const day = dateObj.getDate();

    switch (format) {
      case "monthYear":
        return `${config.monthNames[month]}/${year.toString().slice(-2)}`;
      case "short":
        if (this.currentLanguage === "pt-BR") {
          return `${day.toString().padStart(2, "0")}/${(month + 1)
            .toString()
            .padStart(2, "0")}/${year}`;
        } else {
          return `${(month + 1).toString().padStart(2, "0")}/${day
            .toString()
            .padStart(2, "0")}/${year}`;
        }
      default:
        return dateObj.toLocaleDateString(config.locale);
    }
  },

  getChartFormatConfig(chartConfig) {
    const currentConfig = this.getCurrentFormatConfig();

    return {
      tooltip: {
        locale: currentConfig.locale,
        decimals: chartConfig.numberFormat?.tooltip?.decimals || 2,
        prefix: chartConfig.numberFormat?.tooltip?.prefix || "",
        suffix: chartConfig.numberFormat?.tooltip?.suffix || "",
        useGrouping: chartConfig.numberFormat?.tooltip?.useGrouping !== false,
      },
      axis: {
        locale: currentConfig.locale,
        decimals: chartConfig.numberFormat?.axis?.decimals || 2,
        prefix: chartConfig.numberFormat?.axis?.prefix || "",
        suffix: chartConfig.numberFormat?.axis?.suffix || "",
        useGrouping: chartConfig.numberFormat?.axis?.useGrouping !== false,
      },
      labels: {
        locale: currentConfig.locale,
        decimals: chartConfig.numberFormat?.labels?.decimals || 2,
        prefix: chartConfig.numberFormat?.labels?.prefix || "",
        suffix: chartConfig.numberFormat?.labels?.suffix || "",
        useGrouping: chartConfig.numberFormat?.labels?.useGrouping !== false,
      },
    };
  },
};

const localeConfigs = {
  "pt-BR": {
    apiOverrides: {
      chart5: {
        bitcoinData: {
          apiUrl: "?codigo=BTCUSDTBIN&tipo=completo",
        },
        numberFormat: {
          tooltip: {
            decimals: 0,
            prefix: "$ ",
            locale: "pt-BR",
          },
          axis: {
            decimals: 0,
            prefix: "$ ",
            locale: "pt-BR",
          },
          labels: {
            decimals: 0,
            prefix: "$ ",
            locale: "pt-BR",
          },
        },
        yAxisOptions: {
          min: 40000,
          max: 120000,
          splitNumber: 5,
          scale: false,
        },
      },
      chart10: {
        baseData: "?codigo=CASH3&tipo=historico",
      },
      chart11: {
        baseData: "?codigo=MLIZY&tipo=historico",
        xAxis: {
          source: "historico",
          field: "Data",
        },
        yAxis: {
          source: "historico",
          field: "Ult",
        },
        showAllLabels: true,
        dateFormat: {
          enabled: true,
          format: "monthYear",
        },
        xAxisOptions: {
          boundaryGap: false,
          scale: true,
        },
        gridOptions: {
          left: "15%",
          right: "15%",
          bottom: "15%",
          top: "3%",
        },
      },
      chart12: {
        baseData: "?codigo=BTCUSDTBIN&tipo=completo",
        numberFormat: {
          tooltip: {
            decimals: 0,
            prefix: "$ ",
            locale: "pt-BR",
          },
          axis: {
            decimals: 0,
            prefix: "$ ",
            locale: "pt-BR",
          },
          labels: {
            decimals: 0,
            prefix: "$ ",
            locale: "pt-BR",
          },
        },
      },
      chart13: {
        baseData: "?codigo=CASH3&tipo=historico",
        numberFormat: {
          tooltip: {
            decimals: 2,
            prefix: "$ ",
            abbreviate: true,
            abbreviateType: "short",
            locale: "pt-BR",
          },
          axis: {
            decimals: 0,
            prefix: "$ ",
            abbreviate: true,
            abbreviateType: "short",
          },
          labels: {
            decimals: 0,
            abbreviate: true,
            abbreviateType: "short",
          },
        },
      },
    },
    simpleValuesOverrides: {
      "value-bitcoin-price": {
        apiData: "?codigo=BTCUSDTBIN&tipo=completo",
        numberFormat: {
          decimals: 0,
          prefix: "$ ",
          useGrouping: true,
        },
      },
      "var-bitcoin-price": {
        apiData: "?codigo=BTCBRLBIN&tipo=completo",
      },
    },
  },
  "en-US": {
    apiOverrides: {
      chart5: {
        bitcoinData: {
          apiUrl: "?codigo=BTCUSDTBIN&tipo=completo",
        },
        numberFormat: {
          tooltip: {
            decimals: 0,
            prefix: "$ ",
            locale: "en-US",
          },
          axis: {
            decimals: 0,
            prefix: "$ ",
            locale: "en-US",
          },
          labels: {
            decimals: 0,
            prefix: "$ ",
            locale: "en-US",
          },
        },
        yAxisOptions: {
          min: 40000,
          max: 120000,
          splitNumber: 5,
          scale: false,
        },
      },
      chart10: {
        baseData: "?codigo=CASH3&tipo=historico",
        numberFormat: {
          tooltip: {
            decimals: 2,
            prefix: "R$ ",
          },
          axis: {
            decimals: 2,
            prefix: "R$ ",
          },
          labels: {
            decimals: 2,
            prefix: "R$ ",
          },
        },
      },
      chart11: {
        baseData: "?codigo=MLIZY&tipo=historico",
        xAxis: {
          source: "historico",
          field: "Data",
        },
        yAxis: {
          source: "historico",
          field: "Ult",
        },
        showAllLabels: true,
        dateFormat: {
          enabled: true,
          format: "monthYear",
        },
        xAxisOptions: {
          boundaryGap: false,
          scale: true,
        },
        gridOptions: {
          left: "15%",
          right: "15%",
          bottom: "15%",
          top: "3%",
        },
      },
      chart12: {
        baseData: "?codigo=BTCUSDTBIN&tipo=completo",
        numberFormat: {
          tooltip: {
            decimals: 0,
            prefix: "$ ",
            locale: "en-US",
          },
          axis: {
            decimals: 0,
            prefix: "$ ",
            locale: "en-US",
          },
          labels: {
            decimals: 0,
            prefix: "$ ",
            locale: "en-US",
          },
        },
      },
      chart13: {
        baseData: "?codigo=CASH3&tipo=historico",
        numberFormat: {
          tooltip: {
            decimals: 2,
            prefix: "$ ",
            abbreviate: true,
            abbreviateType: "short",
            locale: "en-US",
          },
          axis: {
            decimals: 0,
            prefix: "$ ",
            abbreviate: true,
            abbreviateType: "short",
          },
          labels: {
            decimals: 0,
            abbreviate: true,
            abbreviateType: "short",
          },
        },
      },
    },
    csvOverrides: {
      dataTable: {
        headers: {
          date: {
            source: "column",
            column: "B",
            row: 0,
          },
          btcAcquisitions: {
            source: "column",
            column: "C",
            row: 0,
          },
          averageAcquisitionCost: {
            source: "column",
            column: "D",
            row: 0,
          },
          acquisitionCost: {
            source: "column",
            column: "E",
            row: 0,
          },
          btcHoldings: {
            source: "column",
            column: "F",
            row: 0,
          },
        },
        columns: {
          date: {
            source: "column",
            column: "B",
            slice: 1,
          },
          btcAcquisitions: {
            source: "column",
            column: "C",
            slice: 2,
          },
          averageAcquisitionCost: {
            source: "column",
            column: "D",
            slice: 2,
          },
          acquisitionCost: {
            source: "column",
            column: "E",
            slice: 2,
          },
          btcHoldings: {
            source: "column",
            column: "F",
            slice: 2,
          },
        },
        numberFormat: {
          btcAcquisitions: {
            decimals: 2,
            prefix: "₿ ",
            locale: "en-US",
          },
          averageAcquisitionCost: {
            decimals: 2,
            prefix: "$ ",
            locale: "en-US",
          },
          acquisitionCost: {
            decimals: 2,
            prefix: "$ ",
            locale: "en-US",
          },
          btcHoldings: {
            decimals: 2,
            prefix: "₿ ",
            locale: "en-US",
          },
        },
      },
      chart1: {
        // yAxis: {
        //   source: "column",
        //   column: "G",
        //   slice: 1,
        // },
        numberFormat: {
          tooltip: {
            decimals: 2,
            prefix: "₿ ",
          },
          axis: {
            decimals: 2,
            prefix: "₿ ",
          },
          labels: {
            decimals: 2,
            prefix: "₿ ",
          },
        },
      },

      chart6: {
        bars: [
          {
            name: "1Q25",
            showIfEmpty: true,
            label: {
              source: "column",
              column: "H",
              slice: 0,
            },
            value: {
              source: "column",
              column: "H",
              slice: 5,
            },
          },
          {
            name: "2Q25",
            showIfEmpty: true,
            label: {
              source: "column",
              column: "I",
              slice: 0,
            },
            value: {
              source: "column",
              column: "I",
              slice: 5,
            },
          },
        ],
        numberFormat: {
          tooltip: {
            decimals: 1,
            suffix: "%",
            transform: { replaceCommaWithDot: true },
          },
          axis: {
            decimals: 1,
            suffix: "%",
            transform: { replaceCommaWithDot: true },
          },
          labels: {
            decimals: 1,
            suffix: "%",
            transform: { replaceCommaWithDot: true },
          },
        },
      },
      chart7: {
        bars: [
          {
            name: "1Q25",
            showIfEmpty: true,
            label: {
              source: "column",
              column: "H",
              slice: 0,
            },
            value: {
              source: "column",
              column: "H",
              slice: 6,
            },
          },
          {
            name: "2Q25",
            showIfEmpty: true,
            label: {
              source: "column",
              column: "I",
              slice: 0,
            },
            value: {
              source: "column",
              column: "I",
              slice: 6,
            },
          },
        ],
        numberFormat: {
          tooltip: {
            decimals: 2,
            // prefix: "$ ",
            transform: { replaceCommaWithDot: true },
          },
          axis: {
            decimals: 2,
            // prefix: "$ ",
            transform: { replaceCommaWithDot: true },
          },
          labels: {
            decimals: 2,
            // prefix: "$ ",
            transform: { replaceCommaWithDot: true },
          },
        },
      },
      chart8: {
        bars: [
          {
            name: "1Q25",
            showIfEmpty: true,
            label: {
              source: "column",
              column: "H",
              slice: 0,
            },
            value: {
              source: "column",
              column: "H",
              slice: 7,
            },
          },
          {
            name: "2Q25",
            showIfEmpty: true,
            label: {
              source: "column",
              column: "I",
              slice: 0,
            },
            value: {
              source: "column",
              column: "I",
              slice: 7,
            },
          },
        ],
        numberFormat: {
          tooltip: {
            decimals: 2,
            prefix: "$ ",
            transform: { replaceCommaWithDot: true },
          },
          axis: {
            decimals: 2,
            prefix: "$ ",
            transform: { replaceCommaWithDot: true },
          },
          labels: {
            decimals: 2,
            prefix: "$ ",
            transform: { replaceCommaWithDot: true },
          },
        },
      },
      chart9: {
        bars: [
          {
            name: "1Q25",
            showIfEmpty: true,
            label: {
              source: "column",
              column: "H",
              slice: 0,
            },
            value: {
              source: "column",
              column: "H",
              slice: 3,
            },
          },
          {
            name: "2Q25",
            showIfEmpty: true,
            label: {
              source: "column",
              column: "I",
              slice: 0,
            },
            value: {
              source: "column",
              column: "I",
              slice: 3,
            },
          },
        ],
        numberFormat: {
          tooltip: {
            decimals: 5,
            prefix: "₿ ",
            transform: { replaceCommaWithDot: true },
          },
          axis: {
            decimals: 5,
            prefix: "₿ ",
            transform: { replaceCommaWithDot: true },
          },
          labels: {
            decimals: 5,
            prefix: "₿ ",
            transform: { replaceCommaWithDot: true },
          },
        },
      },
    },
    simpleValuesOverrides: {
      "value-bitcoin-price": {
        apiData: "?codigo=BTCUSDTBIN&tipo=completo",
        numberFormat: {
          decimals: 0,
          prefix: "$ ",
          useGrouping: true,
        },
      },
      "var-bitcoin-price": {
        apiData: "?codigo=BTCUSDTBIN&tipo=completo",
      },
      "value-cash3-price": {
        apiData: "?codigo=CASH3&tipo=completo",
        numberFormat: {
          decimals: 2,
          prefix: "R$ ",
          useGrouping: true,
          locale: "en-US",
        },
      },
      "var-cash3-price": {
        apiData: "?codigo=CASH3&tipo=completo",
      },
      "var-bitcoin-count": {
        numberFormat: {
          useGrouping: false,
          transform: { replaceCommaWithDot: true },
        },
      },
      "var-btc-per-1000-actions": {
        numberFormat: {
          useGrouping: false,
          transform: { replaceCommaWithDot: true },
        },
      },
      "value-bitcoin-count": {
        numberFormat: {
          decimals: 2,
          prefix: "₿ ",
          useGrouping: true,
        },
      },
      "value-bpap": {
        numberFormat: {
          prefix: "$ ",
          useGrouping: true,
          locale: "pt-BR",
          decimals: 2,
        },
      },
      "value-bse-return": {
        numberFormat: {
          decimals: 1,
          suffix: "%",
          useGrouping: false,
        },
      },
      "value-bse-volume-financeiro": {
        numberFormat: {
          decimals: 1,
          suffix: "%",
          useGrouping: false,
        },
      },
      "value-btc-yield": {
        numberFormat: {
          decimals: 1,
          suffix: "%",
        },
      },
      "value-btc-gains": {
        labelPosition: "after",
        numberFormat: {
          transform: { replaceCommaWithDot: true },
        },
      },
      "value-btc-usd-gain": {
        label: " ",
        labelPosition: "before",
        numberFormat: {
          transform: { replaceCommaWithDot: true },
        },
      },
      "value-btc-per-1000-actions": {
        labelPosition: "after",
        numberFormat: {
          useGrouping: false,
          transform: { replaceCommaWithDot: true },
        },
      },
      "value-quantity-actions": {
        labelPosition: "after",
        numberFormat: {
          transform: { replaceCommaWithDot: true },
        },
      },
      "value-mnav-months-to-cover": {
        // labelPosition: "after",
        numberFormat: {
          transform: { replaceCommaWithDot: true },
        },
      },
      "value-mnav": {
        numberFormat: {
          transform: { replaceCommaWithDot: true },
        },
      },
      "value-btc-ownership-percentage": {
        numberFormat: {
          transform: { replaceCommaWithDot: true },
        },
      },
      "value-bpap": {
        numberFormat: {
          prefix: "$ ",
          useGrouping: true,
          locale: "en-US",
          decimals: 2,
        },
      },
      "value-quantity-actions": {
        labelPosition: "after",
        numberFormat: {
          transform: { replaceDotWithComma: true },
        },
      },
    },
  },
};

const chartsConfig = {
  chart1: {
    type: "csv",
    chartType: "line",
    gid: "1681685606",
    xAxis: {
      source: "column",
      column: "A",
      slice: 2,
    },
    yAxis: {
      source: "column",
      column: "F",
      slice: 1,
    },
    style: {
      color: "#ff6d01",
      smooth: false,
      showSymbol: false,
      areaStyle: true,
    },
    title: "Bitcoin Count",
    numberFormat: {
      tooltip: {
        decimals: 2,
        prefix: "₿ ",
      },
      axis: {
        decimals: 2,
        prefix: "₿ ",
      },
      labels: {
        decimals: 2,
        prefix: "₿ ",
      },
    },
    showCustomIntervalLabels: true,
    customIntervalMonths: 2,
    xAxisOptions: {
      boundaryGap: false,
      scale: true,
    },
    dateFormat: {
      enabled: true,
      format: "monthYear",
    },
    showAllLabels: true,
    gridOptions: {
      left: "6%",
      right: "6%",
      bottom: "8%",
      top: "3%",
    },
  },

  chart5: {
    type: "hybrid",
    chartType: "line",
    bitcoinData: {
      apiUrl: "?codigo=BTCUSDTBIN&tipo=completo",
      xAxis: {
        source: "customIndexPairs",
        regex: /Data:(\d{4}-\d{2}-\d{2})/,
      },
      yAxis: {
        source: "customIndexPairs",
        regex: /Ult:(\d+)/,
      },
    },
    purchaseData: {
      gid: "889580177",
      dates: {
        source: "column",
        column: "A",
        slice: 3,
      },
      acquisitions: {
        source: "column",
        column: "C",
        slice: 3,
      },
    },
    currency: {
      symbol: "",
      type: "dollar",
      detectFrom: "manual",
    },
    numberFormat: {
      tooltip: {
        decimals: 0,
        prefix: "$ ",
      },
      axis: {
        decimals: 0,
        prefix: "$ ",
      },
      labels: {
        decimals: 0,
        prefix: "$ ",
      },
    },
    style: {
      color: "#ff6d01",
      smooth: false,
      showSymbol: false,
      areaStyle: true,
    },
    purchaseStyle: {
      color: "#32CD32",
      symbolSize: 12,
      symbol: "circle",
    },
    title: "Bitcoin Acquisitions",
    showQuarterlyLabels: true,
    enablePurchasePoints: true,
    yAxisOptions: {
      min: 40000,
      max: 120000,
      splitNumber: 5,
      scale: false,
    },
  },

  chart6: {
    type: "csv",
    chartType: "bar",
    gid: "66011945",
    bars: [
      {
        name: "1T25",
        showIfEmpty: true,
        label: {
          source: "column",
          column: "H",
          slice: 1,
        },
        value: {
          source: "column",
          column: "H",
          slice: 5,
        },
      },
      {
        name: "2T25",
        showIfEmpty: true,
        label: {
          source: "column",
          column: "I",
          slice: 1,
        },
        value: {
          source: "column",
          column: "I",
          slice: 5,
        },
      },
    ],
    style: {
      color: "#ff6d01",
      smooth: false,
      showSymbol: false,
      areaStyle: true,
    },
    title: "BTC Yield",
    hideYAxis: true,
    numberFormat: {
      tooltip: {
        decimals: 1,
        suffix: "%",
      },
      axis: {
        decimals: 1,
        suffix: "%",
      },
      labels: {
        decimals: 1,
        suffix: "%",
      },
    },
  },

  chart7: {
    type: "csv",
    chartType: "bar",
    gid: "66011945",
    bars: [
      {
        name: "1T25",
        showIfEmpty: true,
        label: {
          source: "column",
          column: "H",
          slice: 1,
        },
        value: {
          source: "column",
          column: "H",
          slice: 6,
        },
      },
      {
        name: "2T25",
        showIfEmpty: true,
        label: {
          source: "column",
          column: "I",
          slice: 1,
        },
        value: {
          source: "column",
          column: "I",
          slice: 6,
        },
      },
    ],
    style: {
      color: "#ff6d01",
      smooth: false,
      showSymbol: false,
      areaStyle: true,
    },
    title: "BTC Gain",
    hideYAxis: true,
    numberFormat: {
      tooltip: {
        decimals: 2,
      },
      axis: {
        decimals: 2,
      },
      labels: {
        decimals: 2,
      },
    },
  },

  chart8: {
    type: "csv",
    chartType: "bar",
    gid: "66011945",
    bars: [
      {
        name: "1T25",
        showIfEmpty: true,
        label: {
          source: "column",
          column: "H",
          slice: 1,
        },
        value: {
          source: "column",
          column: "H",
          slice: 7,
        },
      },
      {
        name: "2T25",
        showIfEmpty: true,
        label: {
          source: "column",
          column: "I",
          slice: 1,
        },
        value: {
          source: "column",
          column: "I",
          slice: 7,
        },
      },
    ],
    style: {
      color: "#ff6d01",
      smooth: false,
      showSymbol: false,
      areaStyle: true,
    },
    title: "",
    hideYAxis: true,
    numberFormat: {
      tooltip: {
        decimals: 2,
        prefix: "$ ",
      },
      axis: {
        decimals: 2,
        prefix: "$ ",
      },
      labels: {
        decimals: 2,
        prefix: "$ ",
      },
    },
  },

  chart9: {
    type: "csv",
    chartType: "bar",
    gid: "66011945",
    bars: [
      {
        name: "1T25",
        showIfEmpty: true,
        label: {
          source: "column",
          column: "H",
          slice: 1,
        },
        value: {
          source: "column",
          column: "H",
          slice: 3,
        },
      },
      {
        name: "2T25",
        showIfEmpty: true,
        label: {
          source: "column",
          column: "I",
          slice: 1,
        },
        value: {
          source: "column",
          column: "I",
          slice: 3,
        },
      },
    ],
    style: {
      color: "#ff6d01",
      smooth: false,
      showSymbol: false,
      areaStyle: true,
    },
    title: "",
    hideYAxis: true,
    numberFormat: {
      tooltip: {
        decimals: 5,
        prefix: "₿ ",
      },
      axis: {
        decimals: 5,
        prefix: "₿ ",
      },
      labels: {
        decimals: 5,
        prefix: "₿ ",
      },
    },
  },

  chart10: {
    type: "api",
    chartType: "line",
    baseData: "?codigo=CASH3&tipo=historico",
    xAxis: {
      source: "customIndexPairs",
      startIndex: 1,
      step: 2,
      regex: /Data:(\d{4}-\d{2}-\d{2})T/,
    },
    yAxis: {
      source: "customIndexPairs",
      startIndex: 2,
      step: 2,
      regex: /Ult:(\d+(\.\d+)?)/,
    },
    style: {
      color: "#ff6d01",
      smooth: true,
      showSymbol: false,
      areaStyle: true,
    },
    numberFormat: {
      tooltip: {
        decimals: 2,
        prefix: "R$ ",
      },
      axis: {
        decimals: 2,
        prefix: "R$ ",
      },
      labels: {
        decimals: 2,
      },
    },
    title: "CASH3",
    showQuarterlyLabels: true,
  },

  chart11: {
    type: "api",
    chartType: "bar",
    baseData: "?codigo=MLIZY&tipo=historico",
    xAxis: {
      source: "historico",
      field: "Data",
    },
    yAxis: {
      source: "historico",
      field: "Ult",
    },
    style: {
      color: "#ff6d01",
      smooth: false,
      showSymbol: false,
      areaStyle: true,
    },
    numberFormat: {
      tooltip: {
        decimals: 2,
        prefix: "$ ",
      },
      axis: {
        decimals: 2,
        prefix: "$ ",
      },
      labels: {
        decimals: 2,
      },
    },
    title: "MLIZY",
    showAllLabels: true,
    dateFormat: {
      enabled: true,
      format: "monthYear",
    },
    xAxisOptions: {
      boundaryGap: true,
      scale: true,
    },

    hideYAxis: true,
    gridOptions: {
      left: "15%",
      right: "15%",
      bottom: "15%",
      top: "3%",
    },
  },

  chart12: {
    type: "api",
    chartType: "line",
    baseData: "?codigo=BTCUDSTBIN&tipo=completo",
    xAxis: {
      source: "customIndexPairs",
      regex: /Data:(\d{4}-\d{2}-\d{2})/,
    },
    yAxis: {
      source: "customIndexPairs",
      regex: /Ult:(\d+)/,
    },
    style: {
      color: "#ff6d01",
      smooth: true,
      showSymbol: false,
      areaStyle: true,
    },
    numberFormat: {
      tooltip: {
        decimals: 0,
        prefix: "$ ",
      },
      axis: {
        decimals: 0,
        prefix: "$ ",
      },
      labels: {
        decimals: 0,
        prefix: "$ ",
      },
    },
    title: "Bitcoin",
    showQuarterlyLabels: true,
    yAxisOptions: {
      min: 40000,
      max: 120000,
      splitNumber: 5,
      scale: false,
    },
  },

  chart13: {
    type: "hybrid",
    chartType: "line",
    marketCapData: {
      apiUrl: "?codigo=CASH3&tipo=completo",
      xAxis: {
        source: "historico",
        field: "Data",
      },
      yAxis: {
        source: "historico",
        field: "MarketCap",
      },
    },
    bitcoinData: {
      apiUrl: "?codigo=BTCUSDTBIN&tipo=completo",
      xAxis: {
        source: "historico",
        field: "Data",
      },
      yAxis: {
        source: "historico",
        field: "Ult",
      },
    },
    style: {
      marketCap: {
        color: "#ffffff",
        smooth: true,
        showSymbol: false,
        areaStyle: false,
      },
      bitcoinNav: {
        color: "#ff6d01",
        smooth: true,
        showSymbol: false,
        areaStyle: false,
      },
    },
    numberFormat: {
      tooltip: {
        decimals: 2,
        prefix: "$ ",
        suffix: "",
        useGrouping: true,
        abbreviate: true,
        abbreviateType: "short",
      },
      axis: {
        decimals: 0,
        prefix: "$ ",
        suffix: "",
        useGrouping: true,
        abbreviate: true,
        abbreviateType: "short",
      },
    },
    title: "Market Cap vs Bitcoin NAV",
    showQuarterlyLabels: true,
  },

  dataTable: {
    type: "csv",
    gid: "889580177",
    headers: {
      date: {
        source: "column",
        column: "A",
        row: 1,
      },
      btcAcquisitions: {
        source: "column",
        column: "C",
        row: 1,
      },
      averageAcquisitionCost: {
        source: "column",
        column: "D",
        row: 1,
      },
      acquisitionCost: {
        source: "column",
        column: "E",
        row: 1,
      },
      btcHoldings: {
        source: "column",
        column: "F",
        row: 1,
      },
    },
    columns: {
      date: {
        source: "column",
        column: "A",
        slice: 2,
      },
      btcAcquisitions: {
        source: "column",
        column: "C",
        slice: 2,
      },
      averageAcquisitionCost: {
        source: "column",
        column: "D",
        slice: 2,
      },
      acquisitionCost: {
        source: "column",
        column: "E",
        slice: 2,
      },
      btcHoldings: {
        source: "column",
        column: "F",
        slice: 2,
      },
    },
    numberFormat: {
      btcAcquisitions: {
        decimals: 2,
        prefix: "₿ ",
      },
      averageAcquisitionCost: {
        decimals: 2,
        prefix: "$ ",
      },
      acquisitionCost: {
        decimals: 2,
        prefix: "$ ",
      },
      btcHoldings: {
        decimals: 2,
        prefix: "₿ ",
      },
    },
  },
};

const simpleValuesConfig = {
  "var-bitcoin-count": {
    gid: "66011945",
    currentValueHTML: "E",
    currentValuePosition: 2,
  },

  "var-btc-yield": {
    gid: "66011945",
    currentValueHTML: "E",
    currentValuePosition: 5,
  },

  "var-btc-gains": {
    gid: "66011945",
    currentValueHTML: "E",
    currentValuePosition: 6,
  },

  "var-bse-return": {
    gid: "66011945",
    currentValueHTML: "E",
    currentValuePosition: 19,
  },

  "var-btc-gains-usd": {
    gid: "66011945",
    currentValueHTML: "E",
    currentValuePosition: 7,
  },

  "var-btc-per-1000-actions": {
    gid: "66011945",
    currentValueHTML: "E",
    currentValuePosition: 3,
  },

  "value-bitcoin-price": {
    type: "api",
    apiData: "?codigo=BTCUSDTBIN&tipo=completo",
    dataSource: "cotacaoAtual",
    field: "Ult",
    numberFormat: {
      decimals: 0,
      prefix: "$ ",
      useGrouping: true,
    },
  },

  "var-bitcoin-price": {
    type: "api",
    apiData: "?codigo=BTCBRLBIN&tipo=completo",
    dataSource: "cotacaoAtual",
    field: "Var",
    numberFormat: {
      decimals: 2,
      suffix: "%",
      useGrouping: false,
    },
  },

  "value-bitcoin-count": {
    gid: "1681685606",
    currentValueHTML: "B",
    currentValuePosition: 0,
    numberFormat: {
      decimals: 2,
      prefix: "₿ ",
      useGrouping: true,
    },
  },

  "value-cash3-price": {
    type: "api",
    apiData: "?codigo=CASH3&tipo=completo",
    dataSource: "cotacaoAtual",
    field: "Ult",
    numberFormat: {
      decimals: 2,
      prefix: "R$ ",
      useGrouping: true,
    },
  },

  "value-mlizy-price": {
    type: "api",
    apiData: "?codigo=MLIZY&tipo=completo",
    dataSource: "cotacaoAtual",
    field: "Ult",
    numberFormat: {
      decimals: 2,
      prefix: "$ ",
      useGrouping: true,
    },
  },

  "var-cash3-price": {
    type: "api",
    apiData: "?codigo=CASH3&tipo=completo",
    dataSource: "cotacaoAtual",
    field: "Var",
    numberFormat: {
      decimals: 2,
      suffix: "%",
      useGrouping: false,
    },
  },

  "var-mlizy-price": {
    type: "api",
    apiData: "?codigo=MLIZY&tipo=completo",
    dataSource: "cotacaoAtual",
    field: "Var",
    numberFormat: {
      decimals: 2,
      suffix: "%",
      useGrouping: false,
    },
  },

  "value-bpap": {
    gid: "66011945",
    currentValueHTML: "D",
    currentValuePosition: 4,
    numberFormat: {
      prefix: "$ ",
      useGrouping: true,
      decimals: 2,
    },
  },

  // fórmula: (Preço Atual / Preço Base de $3.26) × 100
  "value-bse-return": {
    type: "api",
    apiData: "?codigo=CASH3&tipo=completo",
    dataSource: "cotacaoAtual",
    field: "Ult",
    calculation: {
      operation: "custom",
      formula: "((value/3.26)-1)*100",
    },
    numberFormat: {
      decimals: 1,
      suffix: "%",
      useGrouping: false,
    },
  },

  "value-bse-volume-financeiro": {
    type: "api",
    apiData: "?codigo=CASH3&tipo=completo",
    dataSource: "cotacaoAtual",
    field: "IndicGiroFinanceiro",
    calculation: {
      operation: "custom",
      formula: "(value-1)*100",
    },
    numberFormat: {
      decimals: 1,
      suffix: "%",
      useGrouping: false,
    },
  },

  "value-btc-gains": {
    gid: "66011945",
    currentValueHTML: "G",
    currentValuePosition: 6,
    label: "",
    labelPosition: "after",
  },

  "value-btc-yield": {
    gid: "66011945",
    currentValueHTML: "D",
    currentValuePosition: 5,
  },

  "value-btc-usd-gain": {
    gid: "66011945",
    currentValueHTML: "G",
    currentValuePosition: 7,
    label: " ",
    labelPosition: "before",
  },
  "value-btc-per-1000-actions": {
    gid: "66011945",
    currentValueHTML: "G",
    currentValuePosition: 3,
    labelPosition: "after",
  },
  "value-quantity-actions": {
    gid: "66011945",
    currentValueHTML: "G",
    currentValuePosition: 8,
    labelPosition: "after",
  },
  "value-mnav-months-to-cover": {
    gid: "66011945",
    currentValueHTML: "G",
    currentValuePosition: 17,
    labelPosition: "after",
  },
  "value-mnav": {
    gid: "66011945",
    currentValueHTML: "D",
    currentValuePosition: 9,
  },
  "value-btc-ownership-percentage": {
    gid: "66011945",
    currentValueHTML: "D",
    currentValuePosition: 18,
  },

  "current-value-marketcap": {
    type: "api",
    apiData: "?codigo=CASH3&tipo=completo",
    dataSource: "historico",
    field: "MarketCap",
    getLatest: true,
    numberFormat: {
      decimals: 2,
      prefix: "$ ",
      suffix: "",
      useGrouping: true,
      abbreviate: true,
      abbreviateType: "long",
    },
  },

  "current-value-btc-nav": {
    type: "calculated",
    btcCountConfig: {
      gid: "1681685606",
      currentValueHTML: "F",
      currentValuePosition: "last",
    },
    btcPriceConfig: {
      type: "api",
      apiData: "?codigo=BTCUSDTBIN&tipo=completo",
      dataSource: "cotacaoAtual",
      field: "Ult",
    },
    calculation: "multiply",
    numberFormat: {
      decimals: 2,
      prefix: "$ ",
      suffix: "",
      useGrouping: true,
      abbreviate: true,
      abbreviateType: "long",
    },
  },
};

const translations = {
  "pt-BR": {
    tooltips: {
      btcPurchase: "BTC Compra",
      btcPrice: "Preço:",
      btcYield: "BTC Yield:",
      btcGain: "BTC Gain:",
      btcUsdGain: "BTC US$ Gain (milhões)*",
      bitcoinPerThousand: "Bitcoin por mil ações",
      otherValue: "Outro Valor:",
    },
  },
  "en-US": {
    tooltips: {
      btcPurchase: "BTC acquisition",
      btcPrice: "Price:",
      btcYield: "BTC Yield:",
      btcGain: "BTC Gain:",
      btcUsdGain: "BTC US$ Gain (million)",
      bitcoinPerThousand: "Bitcoin per 1,000 shares",
      otherValue: "Other Value:",
    },
  },
};

function getTranslation(key, category = "tooltips") {
  const currentLang = LanguageManager.currentLanguage;
  const langTranslations = translations[currentLang] || translations["pt-BR"];
  return langTranslations[category]?.[key] || key;
}

function applyLocaleConfigurations() {
  const currentLocale = LanguageManager.currentLanguage;
  const localeConfig = localeConfigs[currentLocale];

  if (!localeConfig) return;

  if (localeConfig.apiOverrides) {
    Object.keys(localeConfig.apiOverrides).forEach((chartKey) => {
      if (chartsConfig[chartKey]) {
        const overrides = localeConfig.apiOverrides[chartKey];
        chartsConfig[chartKey] = mergeDeep(chartsConfig[chartKey], overrides);
      }
    });
  }

  if (localeConfig.csvOverrides) {
    Object.keys(localeConfig.csvOverrides).forEach((chartKey) => {
      if (chartsConfig[chartKey]) {
        const overrides = localeConfig.csvOverrides[chartKey];
        chartsConfig[chartKey] = mergeDeep(chartsConfig[chartKey], overrides);
      }
    });
  }

  if (localeConfig.simpleValuesOverrides) {
    Object.keys(localeConfig.simpleValuesOverrides).forEach((valueKey) => {
      if (simpleValuesConfig[valueKey]) {
        const overrides = localeConfig.simpleValuesOverrides[valueKey];
        simpleValuesConfig[valueKey] = mergeDeep(
          simpleValuesConfig[valueKey],
          overrides
        );
      }
    });
  }
}

function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

let chartData = {};
let gidData = {};
let isDarkMode = false;
let chartInstances = {};

function detectCurrentTheme() {
  return document.body.getAttribute("data-theme") === "dark";
}

function updateChartsTheme() {
  isDarkMode = detectCurrentTheme();

  Object.keys(chartInstances).forEach((chartKey) => {
    const chart = chartInstances[chartKey];
    if (chart && !chart.isDisposed()) {
      if (chartKey === "chart13") {
        createHybridMarketCapChart(chartKey, chartsConfig[chartKey]);
      } else {
        createChart(chartKey);
      }
    }
  });

  Object.keys(chartsConfig).forEach((chartKey) => {
    const config = chartsConfig[chartKey];
    if (shouldUpdateChart(chartKey, config) && !chartInstances[chartKey]) {
      if (chartKey === "chart13") {
        createHybridMarketCapChart(chartKey, config);
      } else {
        createChart(chartKey);
      }
    }
  });

  updateSimpleCurrentValues();
}

function setupThemeObserver() {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        updateChartsTheme();
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}

async function loadCSVFromURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    return null;
  }
}

function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  const rows = [];

  for (let line of lines) {
    if (!line.trim()) continue;
    rows.push(parseCsvLine(line));
  }

  const filteredRows = rows.filter((row) => row.some((cell) => cell !== ""));
  if (filteredRows.length === 0)
    return {
      columnData: {},
    };

  const columnData = {};
  const maxColumns = Math.max(...filteredRows.map((row) => row.length));

  for (let j = 0; j < maxColumns; j++) {
    const columnName = String.fromCharCode(65 + j);
    columnData[columnName] = [];

    for (let i = 0; i < filteredRows.length; i++) {
      const value = filteredRows[i][j];
      if (value !== undefined && value !== null && value !== "") {
        const processedValue = processValue(value.toString().trim());
        columnData[columnName].push(processedValue);
      }
    }

    if (columnData[columnName].length === 0) {
      delete columnData[columnName];
    }
  }

  return {
    columnData,
  };
}

function processValue(cleanValue) {
  if (cleanValue.match(/^-?\d+([.,]\d+)?$/)) {
    return cleanValue;
  }

  if (cleanValue.match(/^-?\d+([.,]\d{3})*([.,]\d+)?$/)) {
    return cleanValue;
  }

  return cleanValue;
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;
  let j = 0;

  while (j < line.length) {
    const char = line[j];
    if (char === '"') {
      if (inQuotes && line[j + 1] === '"') {
        current += '"';
        j += 2;
      } else {
        inQuotes = !inQuotes;
        j++;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      j++;
    } else {
      current += char;
      j++;
    }
  }
  cells.push(current);
  return cells;
}

function cleanApiDate(dateString) {
  if (!dateString) return dateString;

  if (dateString.includes("T")) {
    return dateString.split("T")[0];
  }

  return dateString;
}

function parseApiJsonData(jsonData) {
  const structured = {
    cotacaoAtual: {},
    dadosHistoricos: [],
  };

  if (jsonData.Historico && Array.isArray(jsonData.Historico)) {
    structured.dadosHistoricos = jsonData.Historico.map((item) => ({
      Data: cleanApiDate(item.Data),
      Ult: parseFloat(item.Ult) || 0,
    }));
  }

  if (
    jsonData.dadosHistoricos?.Historico &&
    Array.isArray(jsonData.dadosHistoricos.Historico)
  ) {
    structured.dadosHistoricos = jsonData.dadosHistoricos.Historico.map(
      (item) => ({
        Data: cleanApiDate(item.Data),
        Ult: parseFloat(item.Ult) || 0,
      })
    );
  }

  if (jsonData.Ult) {
    structured.cotacaoAtual = {
      Ult: parseFloat(jsonData.Ult) || 0,
    };
  }

  if (
    jsonData.cotacaoAtual &&
    Array.isArray(jsonData.cotacaoAtual) &&
    jsonData.cotacaoAtual.length > 0
  ) {
    const cotacao = jsonData.cotacaoAtual[0];
    structured.cotacaoAtual = {
      Ult: parseFloat(cotacao.Ult) || 0,
      Data: cotacao.Data,
      Hora: cotacao.Hora,
      Var: parseFloat(cotacao.Var) || 0,
      Max: parseFloat(cotacao.Max) || 0,
      Min: parseFloat(cotacao.Min) || 0,
      Abe: parseFloat(cotacao.Abe) || 0,
      Med: parseFloat(cotacao.Med) || 0,
      Fec: parseFloat(cotacao.Fec) || 0,
      VarAnt: parseFloat(cotacao.VarAnt) || 0,
      IndicGiroFinanceiro: parseFloat(cotacao.IndicGiroFinanceiro) || 0,
    };
  }

  return structured;
}

function parseApiTextToStructuredData(rows) {
  const structured = {
    cotacaoAtual: {},
    dadosHistoricos: [],
  };

  let currentSection = null;

  for (let i = 0; i < rows.length; i++) {
    const cell = rows[i]?.[0]?.trim();
    if (!cell) continue;

    if (cell.startsWith("{cotacaoAtual:[")) {
      currentSection = "cotacaoAtual";
      continue;
    }

    if (cell.startsWith("dadosHistoricos:{")) {
      currentSection = "dadosHistoricos";
      continue;
    }

    if (cell === "}]}" || cell === "}]}") continue;

    const match = cell.match(/^(\w+):(.+)$/);
    if (!match) continue;

    const key = match[1];
    const rawValue = match[2].trim();
    const numeric = parseFloat(rawValue);
    const value = isNaN(numeric) ? rawValue : numeric;

    if (currentSection === "cotacaoAtual") {
      structured.cotacaoAtual[key] = value;
    } else if (currentSection === "dadosHistoricos") {
      if (key === "Data") {
        structured.dadosHistoricos.push({
          [key]: cleanApiDate(value),
        });
      } else if (structured.dadosHistoricos.length > 0) {
        const last =
          structured.dadosHistoricos[structured.dadosHistoricos.length - 1];
        last[key] = value;
      }
    }
  }

  return structured;
}

async function loadApiData(chartKey, config) {
  if (chartKey === "chart10") {
    chartData[chartKey] = {
      structured: {
        cotacaoAtual: { Ult: 8.45, Var: 2.15 },
        dadosHistoricos: [
          { Data: "2024-01-01", Ult: 8.2 },
          { Data: "2024-01-02", Ult: 8.25 },
          { Data: "2024-01-03", Ult: 8.3 },
          { Data: "2024-01-04", Ult: 8.35 },
          { Data: "2024-01-05", Ult: 8.4 },
          { Data: "2024-01-08", Ult: 8.38 },
          { Data: "2024-01-09", Ult: 8.42 },
          { Data: "2024-01-10", Ult: 8.45 },
          { Data: "2024-01-11", Ult: 8.43 },
          { Data: "2024-01-12", Ult: 8.47 },
          { Data: "2024-01-15", Ult: 8.45 },
        ],
      },
    };
    createChart(chartKey);
    return;
  }

  if (chartKey === "chart11") {
    chartData[chartKey] = {
      structured: {
        cotacaoAtual: { Ult: 1.85, Var: -1.25 },
        dadosHistoricos: [
          { Data: "2024-01-01", Ult: 1.9 },
          { Data: "2024-01-02", Ult: 1.88 },
          { Data: "2024-01-03", Ult: 1.87 },
          { Data: "2024-01-04", Ult: 1.89 },
          { Data: "2024-01-05", Ult: 1.86 },
          { Data: "2024-01-08", Ult: 1.84 },
          { Data: "2024-01-09", Ult: 1.83 },
          { Data: "2024-01-10", Ult: 1.85 },
          { Data: "2024-01-11", Ult: 1.87 },
          { Data: "2024-01-12", Ult: 1.86 },
          { Data: "2024-01-15", Ult: 1.85 },
        ],
      },
    };
    createChart(chartKey);
    return;
  }

  if (chartKey === "chart12") {
    chartData[chartKey] = {
      structured: {
        cotacaoAtual: { Ult: 67500, Var: 3.45 },
        dadosHistoricos: [
          { Data: "2024-01-01", Ult: 65200 },
          { Data: "2024-01-02", Ult: 65800 },
          { Data: "2024-01-03", Ult: 66200 },
          { Data: "2024-01-04", Ult: 66800 },
          { Data: "2024-01-05", Ult: 67100 },
          { Data: "2024-01-08", Ult: 67300 },
          { Data: "2024-01-09", Ult: 67600 },
          { Data: "2024-01-10", Ult: 67800 },
          { Data: "2024-01-11", Ult: 67500 },
          { Data: "2024-01-12", Ult: 67700 },
          { Data: "2024-01-15", Ult: 67500 },
        ],
      },
    };
    createChart(chartKey);
    return;
  }

  const directUrl = CHART_CONFIG.API_BASE_URL + config.baseData;
  const proxiedUrl = CHART_CONFIG.CORS_PROXY + encodeURIComponent(directUrl);

  try {
    const response = await fetch(proxiedUrl);
    if (!response.ok) {
      return;
    }

    const responseText = await response.text();

    let jsonData = null;
    try {
      jsonData = JSON.parse(responseText);
    } catch (jsonError) {
      const lines = responseText.trim().split(/\r?\n/);
      const rows = lines
        .map(parseCsvLine)
        .filter((row) => row.some((cell) => cell !== ""));

      const structuredData = parseApiTextToStructuredData(rows);

      chartData[chartKey] = {
        structured: structuredData,
        customIndexPairs: rows,
      };

      createChart(chartKey);
      return;
    }

    const structuredData = parseApiJsonData(jsonData);

    chartData[chartKey] = {
      structured: structuredData,
      jsonData: jsonData,
    };

    createChart(chartKey);
  } catch (error) {}
}

async function loadHybridData(chartKey, config) {
  try {
    const bitcoinDirectUrl =
      CHART_CONFIG.API_BASE_URL + config.bitcoinData.apiUrl;
    const bitcoinProxiedUrl =
      CHART_CONFIG.CORS_PROXY + encodeURIComponent(bitcoinDirectUrl);

    const bitcoinResponse = await fetch(bitcoinProxiedUrl);
    if (!bitcoinResponse.ok) {
      return;
    }

    const bitcoinResponseText = await bitcoinResponse.text();
    let bitcoinData = null;

    try {
      const jsonData = JSON.parse(bitcoinResponseText);
      bitcoinData = {
        structured: parseApiJsonData(jsonData),
        jsonData: jsonData,
      };
    } catch (jsonError) {
      const lines = bitcoinResponseText.trim().split(/\r?\n/);
      const rows = lines
        .map(parseCsvLine)
        .filter((row) => row.some((cell) => cell !== ""));
      bitcoinData = {
        structured: parseApiTextToStructuredData(rows),
        customIndexPairs: rows,
      };
    }

    const purchaseData = await loadCSVFromURL(
      CHART_CONFIG.BASE_SHEET_URL + config.purchaseData.gid
    );
    if (!purchaseData || !purchaseData.columnData) {
      return;
    }

    chartData[chartKey] = {
      bitcoin: bitcoinData,
      purchase: purchaseData.columnData,
    };

    createChart(chartKey);
  } catch (error) {}
}

async function loadHybridMarketCapData(chartKey, config) {
  try {
    const marketCapDirectUrl =
      CHART_CONFIG.API_BASE_URL + config.marketCapData.apiUrl;
    const marketCapProxiedUrl =
      CHART_CONFIG.CORS_PROXY + encodeURIComponent(marketCapDirectUrl);

    const marketCapResponse = await fetch(marketCapProxiedUrl);
    let marketCapResponseText;

    if (!marketCapResponse.ok) {
      const directResponse = await fetch(marketCapDirectUrl);
      if (!directResponse.ok) {
        return;
      }
      marketCapResponseText = await directResponse.text();
    } else {
      marketCapResponseText = await marketCapResponse.text();
    }

    let marketCapData = null;

    try {
      const jsonData = JSON.parse(marketCapResponseText);
      marketCapData = {
        structured: parseApiJsonData(jsonData),
        jsonData: jsonData,
      };
    } catch (jsonError) {
      const lines = marketCapResponseText.trim().split(/\r?\n/);
      const rows = lines
        .map(parseCsvLine)
        .filter((row) => row.some((cell) => cell !== ""));
      marketCapData = {
        structured: parseApiTextToStructuredData(rows),
        customIndexPairs: rows,
      };
    }

    const bitcoinDirectUrl =
      CHART_CONFIG.API_BASE_URL + config.bitcoinData.apiUrl;
    const bitcoinProxiedUrl =
      CHART_CONFIG.CORS_PROXY + encodeURIComponent(bitcoinDirectUrl);

    const bitcoinResponse = await fetch(bitcoinProxiedUrl);
    let bitcoinResponseText;

    if (!bitcoinResponse.ok) {
      // Tentar sem o proxy CORS
      const directBitcoinUrl =
        CHART_CONFIG.API_BASE_URL + config.bitcoinData.apiUrl;
      const directBitcoinResponse = await fetch(directBitcoinUrl);
      if (!directBitcoinResponse.ok) {
        return;
      }
      bitcoinResponseText = await directBitcoinResponse.text();
    } else {
      bitcoinResponseText = await bitcoinResponse.text();
    }

    let bitcoinData = null;

    try {
      const jsonData = JSON.parse(bitcoinResponseText);
      bitcoinData = {
        structured: parseApiJsonData(jsonData),
        jsonData: jsonData,
      };
    } catch (jsonError) {
      const lines = bitcoinResponseText.trim().split(/\r?\n/);
      const rows = lines
        .map(parseCsvLine)
        .filter((row) => row.some((cell) => cell !== ""));
      bitcoinData = {
        structured: parseApiTextToStructuredData(rows),
        customIndexPairs: rows,
      };
    }

    const btcHoldingsData = await loadCSVFromURL(
      CHART_CONFIG.BASE_SHEET_URL + "1681685606"
    );
    if (!btcHoldingsData || !btcHoldingsData.columnData) {
      return;
    }

    chartData[chartKey] = {
      marketCap: marketCapData,
      bitcoin: bitcoinData,
      btcHoldings: btcHoldingsData.columnData,
    };

    createChart(chartKey);
  } catch (error) {
    console.error(
      `Error loading hybrid market cap data for ${chartKey}:`,
      error
    );
    console.error(`Error stack:`, error.stack);
  }
}

async function loadRawColumnE(csvUrl) {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) return [];
    const csvText = await response.text();

    const lines = csvText.trim().split(/\r?\n/);
    const columnE = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const cells = parseCsvLine(line);
      const valueE = cells[4] || "";
      columnE.push(valueE);
    }

    return columnE;
  } catch (error) {
    return [];
  }
}

// PROCESSAMENTO DE DADOS

function extractAxisData(csvData, axisConfig) {
  if (!axisConfig) return [];

  switch (axisConfig.source) {
    case "column":
      return extractColumnData(csvData, axisConfig);
    case "row":
      return extractRowData(csvData, axisConfig);
    case "range":
      return extractRangeData(csvData, axisConfig);
    case "fixed":
      return axisConfig.data || [];
    case "customIndexPairs":
      return extractCustomIndexPairs(csvData, axisConfig);
    case "historico":
      return extractHistoricoData(csvData, axisConfig);
    default:
      return [];
  }
}

function extractHistoricoData(csvData, config) {
  if (
    csvData.jsonData?.dadosHistoricos?.Historico &&
    Array.isArray(csvData.jsonData.dadosHistoricos.Historico)
  ) {
    const historico = csvData.jsonData.dadosHistoricos.Historico;

    const result = historico
      .map((item) => {
        const value = item[config.field];
        if (config.field === "Data" && typeof value === "string") {
          return cleanApiDate(value);
        }
        return value;
      })
      .filter(Boolean)
      .reverse();

    return result;
  }

  if (
    csvData.structured?.dadosHistoricos &&
    Array.isArray(csvData.structured.dadosHistoricos)
  ) {
    const historico = csvData.structured.dadosHistoricos;
    return historico
      .map((item) => {
        const value = item[config.field];
        if (config.field === "Data" && typeof value === "string") {
          return cleanApiDate(value);
        }
        return value;
      })
      .filter(Boolean)
      .reverse();
  }

  return [];
}

function extractCustomIndexPairs(csvData, config) {
  if (csvData.structured?.dadosHistoricos) {
    const list = csvData.structured.dadosHistoricos;
    const key = config.regex.toString().includes("Data") ? "Data" : "Ult";
    const result = list
      .map((item) => item[key])
      .filter(Boolean)
      .reverse();

    return result;
  }

  if (
    csvData.jsonData?.Historico &&
    Array.isArray(csvData.jsonData.Historico)
  ) {
    const list = csvData.jsonData.Historico;
    const key = config.regex.toString().includes("Data") ? "Data" : "Ult";
    const result = list
      .map((item) => item[key])
      .filter(Boolean)
      .reverse();

    return result;
  }

  if (
    csvData.jsonData?.dadosHistoricos?.Historico &&
    Array.isArray(csvData.jsonData.dadosHistoricos.Historico)
  ) {
    const list = csvData.jsonData.dadosHistoricos.Historico;
    const key = config.regex.toString().includes("Data") ? "Data" : "Ult";
    const result = list
      .map((item) => item[key])
      .filter(Boolean)
      .reverse();

    return result;
  }

  const results = [];
  const dataToSearch = csvData.customIndexPairs || csvData;

  for (
    let i = config.startIndex || 0;
    i < dataToSearch.length;
    i += config.step || 1
  ) {
    const row = dataToSearch[i];
    const cell = Array.isArray(row) ? row[0] : row;
    if (cell && typeof cell === "string") {
      const match = cell.match(config.regex);
      if (match) {
        const value = config.regex.toString().includes("Data")
          ? match[1]
          : parseFloat(match[1]);
        if (!isNaN(value)) {
          results.push(value);
        }
      }
    }
  }

  const finalResult = results.reverse();

  return finalResult;
}

function extractColumnData(csvData, config) {
  const columnData = csvData[config.column] || [];

  if (config.row !== undefined) {
    return [columnData[config.row] || ""];
  }

  const startIndex = config.slice || 0;
  const endIndex = config.end || columnData.length;
  return columnData.slice(startIndex, endIndex);
}

function extractRowData(csvData, config) {
  const rowIndex = config.row || 0;
  const startCol = config.start || 0;
  const endCol = config.end || 26;
  const rowData = [];

  for (let i = startCol; i < endCol; i++) {
    const columnName = String.fromCharCode(65 + i);
    const columnData = csvData[columnName];
    if (columnData && columnData[rowIndex] !== undefined) {
      rowData.push(columnData[rowIndex]);
    }
  }
  return rowData;
}

function extractRangeData(csvData, config) {
  const columnData = csvData[config.column] || [];
  const rows = config.rows || [];
  return rows
    .map((rowIndex) => columnData[rowIndex])
    .filter((value) => value !== undefined);
}

function processNumericData(data, preserveFormat = false) {
  const result = data
    .map((v) => {
      if (typeof v === "number")
        return preserveFormat
          ? {
              value: v,
              original: v.toString(),
            }
          : v;

      if (typeof v === "string") {
        let cleanValue = v.trim();
        if (!cleanValue || cleanValue === "" || cleanValue === "-") {
          return preserveFormat
            ? {
                value: 0,
                original: "0",
              }
            : 0;
        }

        if (cleanValue.includes("%")) {
          const numericPart = cleanValue.replace("%", "").replace(",", ".");
          const num = parseFloat(numericPart);
          if (preserveFormat) {
            return isNaN(num)
              ? {
                  value: 0,
                  original: "0%",
                }
              : {
                  value: num,
                  original: cleanValue,
                };
          }
          return isNaN(num) ? 0 : num;
        }

        let cleanedValue = cleanValue.replace(/[₿$R€£¥\s]/g, "");
        let num;

        if (preserveFormat) {
          return {
            value: parseFloat(cleanedValue.replace(",", ".")),
            original: cleanValue,
          };
        } else {
          cleanedValue = cleanedValue.replace(",", ".");
          num = parseFloat(cleanedValue);
        }
        if (preserveFormat) {
          return isNaN(num)
            ? {
                value: 0,
                original: cleanValue,
              }
            : {
                value: num,
                original: cleanValue,
              };
        }
        return isNaN(num) ? 0 : num;
      }
      return preserveFormat
        ? {
            value: 0,
            original: "0",
          }
        : 0;
    })
    .filter((v) => (preserveFormat ? !isNaN(v.value) : !isNaN(v)));

  return result;
}

function extractRawColumnE(csvData, config) {
  const fullColumnE = csvData["E_RAW"] || [];
  const startIndex = config.slice || 3;
  return fullColumnE.slice(startIndex);
}

function createPurchasePointsExact(purchaseDataRaw, bitcoinValues) {
  const result = [];

  for (let i = 0; i < purchaseDataRaw.length && i < bitcoinValues.length; i++) {
    const cellValue = purchaseDataRaw[i];

    if (
      cellValue &&
      typeof cellValue === "string" &&
      cellValue.includes("$") &&
      /\d/.test(cellValue)
    ) {
      result.push({
        value: [i, bitcoinValues[i]],
        purchaseValue: cellValue,
      });
    }
  }

  return result;
}

// CRIAÇÃO DE GRÁFICOS

function shouldUpdateChart(chartKey, config) {
  if (config.type === "csv") {
    return chartData[chartKey] && Object.keys(chartData[chartKey]).length > 0;
  }
  if (config.type === "api") {
    return chartData[chartKey] && Object.keys(chartData[chartKey]).length > 0;
  }
  if (config.type === "hybrid") {
    if (chartKey === "chart13") {
      return (
        chartData[chartKey] &&
        chartData[chartKey].marketCap &&
        chartData[chartKey].bitcoin &&
        chartData[chartKey].btcHoldings
      );
    } else {
      return (
        chartData[chartKey] &&
        chartData[chartKey].bitcoin &&
        chartData[chartKey].purchase
      );
    }
  }
  return false;
}

function createChart(chartKey) {
  const config = chartsConfig[chartKey];
  if (
    !config ||
    (config.type !== "csv" &&
      config.type !== "api" &&
      config.type !== "hybrid" &&
      config.type !== "hybrid-dual")
  )
    return;

  if (config.type === "csv") {
    createCsvChart(chartKey, config);
  } else if (config.type === "api") {
    createApiChart(chartKey, config);
  } else if (config.type === "hybrid") {
    if (chartKey === "chart13") {
      createHybridMarketCapChart(chartKey, config);
    } else {
      createHybridChart(chartKey, config);
    }
  } else if (config.type === "hybrid-dual") {
    createHybridDualChart(chartKey, config);
  }
}

function createCsvChart(chartKey, config) {
  if (!chartData[chartKey]) return;

  const chart = echarts.init(
    document.getElementById(chartKey),
    isDarkMode ? "dark" : null
  );
  chartInstances[chartKey] = chart;

  if (!chartData[chartKey] || Object.keys(chartData[chartKey]).length === 0) {
    return;
  }

  if (config.series && config.chartType === "bar") {
    createMultiSeriesBarChart(chartKey, config, chart);
    return;
  }

  if (config.bars && config.chartType === "bar") {
    createSeparateLabelsBarChart(chartKey, config, chart);
    return;
  }

  const xData = extractAxisData(chartData[chartKey], config.xAxis);
  const yData = extractAxisData(chartData[chartKey], config.yAxis);

  const preserveFormat =
    chartKey === "chart1" ||
    chartKey === "chart6" ||
    chartKey === "chart7" ||
    chartKey === "chart8" ||
    chartKey === "chart9";
  const yNumbers = processNumericData(yData, preserveFormat);

  if (xData.length === 0 || yNumbers.length === 0) return;

  const minLength = Math.min(xData.length, yNumbers.length);
  const syncedXData = xData.slice(0, minLength);
  const syncedYData = yNumbers.slice(0, minLength);

  let purchasePoints = [];
  if (chartKey === "chart5" && config.enablePurchasePoints) {
    const purchaseDataRaw = extractRawColumnE(
      chartData[chartKey],
      config.purchaseData
    );
    purchasePoints = createPurchasePointsExact(purchaseDataRaw, syncedYData);
  }

  const option = buildChartOption(
    syncedXData,
    syncedYData,
    config,
    purchasePoints,
    chartKey
  );

  chart.setOption(option);

  chart.on("finished", () =>
    document.getElementById(chartKey).classList.add("loaded")
  );
  setTimeout(
    () => document.getElementById(chartKey).classList.add("loaded"),
    3000
  );
  window.addEventListener("resize", () => chart.resize());
}

function createMultiSeriesBarChart(chartKey, config, chart) {
  const xData = extractAxisData(chartData[chartKey], config.xAxis);

  if (xData.length === 0) return;

  const series = [];

  for (const seriesConfig of config.series) {
    const yData = extractAxisData(chartData[chartKey], {
      source: "column",
      column: seriesConfig.column,
      slice: seriesConfig.slice,
    });

    const yNumbers = processNumericData(yData, false);

    if (yNumbers.length > 0) {
      const minLength = Math.min(xData.length, yNumbers.length);
      const syncedYData = yNumbers.slice(0, minLength);

      series.push({
        name: seriesConfig.name,
        type: "bar",
        data: syncedYData,
        itemStyle: {
          color: seriesConfig.color,
        },
      });
    }
  }

  if (series.length === 0) return;

  const colors = getThemeColors();

  const option = {
    backgroundColor: colors.background,
    tooltip: {
      trigger: "axis",
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: {
        color: colors.text,
      },
    },
    legend: {
      data: series.map((s) => s.name),
      textStyle: {
        color: colors.text,
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "15%",
      top: "15%",
      height: "80%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xData,
      axisLabel: {
        color: colors.text,
        margin: 25,
        align: "left",
        verticalAlign: "top",
        rotate: 0,
        offset: [5, 0],
      },
      axisLine: {
        lineStyle: {
          color: colors.border,
        },
      },
    },
    yAxis: buildYAxisConfig(colors, config),
    series: series,
  };

  chart.setOption(option);

  chart.on("finished", () =>
    document.getElementById(chartKey).classList.add("loaded")
  );
  setTimeout(
    () => document.getElementById(chartKey).classList.add("loaded"),
    3000
  );
  window.addEventListener("resize", () => chart.resize());
}

function createSeparateLabelsBarChart(chartKey, config, chart) {
  const bars = [];

  for (const barConfig of config.bars) {
    const label = extractAxisData(chartData[chartKey], barConfig.label);
    const value = extractAxisData(chartData[chartKey], barConfig.value);

    let labelValue = barConfig.name || "Sem dados";
    let numericValue = 0;
    let originalValueString = null;
    let hasData = false;

    if (label.length > 0) {
      labelValue = label[0];
    }

    if (value.length > 0) {
      const processedValuePreserved = processNumericData(value, true)[0];
      if (
        processedValuePreserved &&
        processedValuePreserved.value !== undefined &&
        !isNaN(processedValuePreserved.value)
      ) {
        numericValue = processedValuePreserved.value;
        originalValueString = processedValuePreserved.original;
        hasData = true;
      }
    }

    if (hasData || barConfig.showIfEmpty) {
      bars.push({
        name: labelValue,
        value: numericValue,
        original: originalValueString,
      });
    }
  }

  if (bars.length === 0) return;

  const xData = bars.map((bar) => bar.name);
  const yData = bars.map((bar) => ({
    value: bar.value,
    original: bar.original ?? "",
  }));

  const option = buildChartOption(xData, yData, config, [], chartKey);

  chart.setOption(option);

  chart.on("finished", () =>
    document.getElementById(chartKey).classList.add("loaded")
  );
  setTimeout(
    () => document.getElementById(chartKey).classList.add("loaded"),
    3000
  );
  window.addEventListener("resize", () => chart.resize());
}

function createApiChart(chartKey, config) {
  if (!chartData[chartKey]) {
    console.error(`No data found for chart ${chartKey}`);
    return;
  }

  const chartElement = document.getElementById(chartKey);
  if (!chartElement) {
    console.error(`Chart element not found for ${chartKey}`);
    return;
  }

  const chart = echarts.init(chartElement, isDarkMode ? "dark" : null);
  chartInstances[chartKey] = chart;

  if (!chartData[chartKey] || Object.keys(chartData[chartKey]).length === 0) {
    console.error(`Chart data is empty for ${chartKey}`);
    return;
  }

  const xData = extractAxisData(chartData[chartKey], config.xAxis);
  const yData = extractAxisData(chartData[chartKey], config.yAxis);

  const yNumbers = processNumericData(yData, false);

  if (xData.length === 0 || yNumbers.length === 0) {
    console.error(`No data to plot for ${chartKey}`);
    return;
  }

  const minLength = Math.min(xData.length, yNumbers.length);
  const syncedXData = xData.slice(0, minLength);
  const syncedYData = yNumbers.slice(0, minLength);

  const option = buildChartOption(
    syncedXData,
    syncedYData,
    config,
    [],
    chartKey
  );

  chart.setOption(option);

  chart.on("finished", () =>
    document.getElementById(chartKey).classList.add("loaded")
  );
  setTimeout(
    () => document.getElementById(chartKey).classList.add("loaded"),
    3000
  );
  window.addEventListener("resize", () => chart.resize());
}

function createHybridChart(chartKey, config) {
  if (!chartData[chartKey]) return;

  const chart = echarts.init(
    document.getElementById(chartKey),
    isDarkMode ? "dark" : null
  );
  chartInstances[chartKey] = chart;

  if (
    !chartData[chartKey] ||
    !chartData[chartKey].bitcoin ||
    !chartData[chartKey].purchase
  ) {
    return;
  }

  const bitcoinXData = extractAxisData(
    chartData[chartKey].bitcoin,
    config.bitcoinData.xAxis
  );
  const bitcoinYData = extractAxisData(
    chartData[chartKey].bitcoin,
    config.bitcoinData.yAxis
  );
  const bitcoinYNumbers = processNumericData(bitcoinYData, false);

  const purchaseDates = extractAxisData(
    chartData[chartKey].purchase,
    config.purchaseData.dates
  );
  const purchaseValues = extractAxisData(
    chartData[chartKey].purchase,
    config.purchaseData.acquisitions
  );

  if (bitcoinXData.length === 0 || bitcoinYNumbers.length === 0) return;

  const minLength = Math.min(bitcoinXData.length, bitcoinYNumbers.length);
  const syncedBitcoinXData = bitcoinXData.slice(0, minLength);
  const syncedBitcoinYData = bitcoinYNumbers.slice(0, minLength);

  const purchasePoints = [];
  for (let i = 0; i < purchaseDates.length; i++) {
    const purchaseDate = purchaseDates[i];
    const purchaseValue = purchaseValues[i];

    let purchaseDateISO;
    if (purchaseDate.includes("/")) {
      const parts = purchaseDate.split("/");
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      purchaseDateISO = `${year}-${month}-${day}`;
    } else {
      purchaseDateISO = purchaseDate;
    }

    const bitcoinIndex = syncedBitcoinXData.findIndex((bitcoinDate) =>
      bitcoinDate.includes(purchaseDateISO)
    );

    if (bitcoinIndex !== -1) {
      purchasePoints.push({
        value: [bitcoinIndex, syncedBitcoinYData[bitcoinIndex]],
        purchaseValue: purchaseValue,
        purchaseDate: purchaseDate,
      });
    }
  }

  const option = buildChartOption(
    syncedBitcoinXData,
    syncedBitcoinYData,
    config,
    purchasePoints,
    chartKey
  );

  chart.setOption(option);

  chart.on("finished", () =>
    document.getElementById(chartKey).classList.add("loaded")
  );
  setTimeout(
    () => document.getElementById(chartKey).classList.add("loaded"),
    3000
  );
  window.addEventListener("resize", () => chart.resize());
}

function createHybridMarketCapChart(chartKey, config) {
  if (!chartData[chartKey]) {
    return;
  }

  const chartElement = document.getElementById(chartKey);
  if (!chartElement) {
    console.error(`Chart element not found for ${chartKey}`);
    return;
  }

  const chart = echarts.init(chartElement, isDarkMode ? "dark" : null);
  chartInstances[chartKey] = chart;

  if (
    !chartData[chartKey] ||
    !chartData[chartKey].marketCap ||
    !chartData[chartKey].bitcoin ||
    !chartData[chartKey].btcHoldings
  ) {
    console.error("Missing data for chart13:", {
      marketCap: !!chartData[chartKey]?.marketCap,
      bitcoin: !!chartData[chartKey]?.bitcoin,
      btcHoldings: !!chartData[chartKey]?.btcHoldings,
    });
    return;
  }

  const btcHoldingsDates = extractAxisData(chartData[chartKey].btcHoldings, {
    source: "column",
    column: "A", // Coluna de datas
    slice: 2,
  });

  const btcHoldingsValues = extractAxisData(chartData[chartKey].btcHoldings, {
    source: "column",
    column: "F", // Coluna BTC Count
    slice: 0,
  });
  const btcHoldingsNumbers = processNumericData(btcHoldingsValues, false);

  const marketCapXData = extractAxisData(
    chartData[chartKey].marketCap,
    config.marketCapData.xAxis
  );
  const marketCapYData = extractAxisData(
    chartData[chartKey].marketCap,
    config.marketCapData.yAxis
  );
  const marketCapYNumbers = processNumericData(marketCapYData, false);

  const bitcoinXData = extractAxisData(
    chartData[chartKey].bitcoin,
    config.bitcoinData.xAxis
  );
  const bitcoinYData = extractAxisData(
    chartData[chartKey].bitcoin,
    config.bitcoinData.yAxis
  );
  const bitcoinPrices = processNumericData(bitcoinYData, false);

  if (
    marketCapXData.length === 0 ||
    marketCapYNumbers.length === 0 ||
    bitcoinXData.length === 0 ||
    bitcoinPrices.length === 0 ||
    btcHoldingsDates.length === 0 ||
    btcHoldingsNumbers.length === 0
  ) {
    console.error("Missing data for Bitcoin NAV calculation");
    return;
  }

  let firstBitcoinDate = null;
  if (btcHoldingsDates.length > 0) {
    const firstDateStr = btcHoldingsDates[0];
    if (firstDateStr && firstDateStr.includes("/")) {
      const parts = firstDateStr.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        let year = parts[2];
        if (year.length === 2) {
          year = "20" + year;
        }
        firstBitcoinDate = `${year}-${month}-${day}`;
      }
    } else if (firstDateStr && firstDateStr.includes("-")) {
      firstBitcoinDate = firstDateStr.split("T")[0];
    }
  }

  if (!firstBitcoinDate) {
    firstBitcoinDate = "2025-01-17";
  }

  const filteredMarketCapData = [];
  const filteredMarketCapDates = [];

  for (let i = 0; i < marketCapXData.length; i++) {
    const marketCapDate = marketCapXData[i];

    let dateToCompare = null;
    if (marketCapDate.includes("/")) {
      const parts = marketCapDate.split("/");
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      let year = parts[2];
      if (year.length === 2) {
        year = "20" + year;
      }
      dateToCompare = `${year}-${month}-${day}`;
    } else if (marketCapDate.includes("-")) {
      dateToCompare = marketCapDate.split("T")[0];
    }

    if (dateToCompare && dateToCompare >= firstBitcoinDate) {
      filteredMarketCapDates.push(marketCapDate);
      filteredMarketCapData.push(marketCapYNumbers[i]);
    }
  }

  const finalMarketCapDates =
    filteredMarketCapDates.length > 0 ? filteredMarketCapDates : marketCapXData;
  const finalMarketCapData =
    filteredMarketCapData.length > 0
      ? filteredMarketCapData
      : marketCapYNumbers;

  const bitcoinNavValues = calculateBitcoinNav(
    finalMarketCapDates,
    btcHoldingsDates,
    btcHoldingsNumbers,
    bitcoinXData,
    bitcoinPrices
  );

  const option = buildHybridMarketCapChartOption(
    finalMarketCapDates,
    finalMarketCapData,
    finalMarketCapDates,
    bitcoinNavValues,
    config,
    chartKey
  );

  chart.setOption(option);

  chart.on("finished", () =>
    document.getElementById(chartKey).classList.add("loaded")
  );
  setTimeout(
    () => document.getElementById(chartKey).classList.add("loaded"),
    3000
  );
  window.addEventListener("resize", () => chart.resize());
}

function buildChartOption(xData, yData, config, purchasePoints = [], chartKey) {
  const colors = getThemeColors();

  return {
    backgroundColor: colors.background,
    tooltip: buildTooltipConfig(config, chartKey),
    grid: {
      left: config.gridOptions?.left || (config.hideYAxis ? "5%" : "8%"),
      right: config.gridOptions?.right || (config.hideYAxis ? "5%" : "8%"),
      bottom: config.gridOptions?.bottom || "20%",
      top: config.gridOptions?.top || "5%",
      height: "85%",
      containLabel: true,
    },
    xAxis: buildXAxisConfig(xData, colors, config.chartType, {
      ...config,
      chartKey,
    }),
    yAxis: buildYAxisConfig(colors, {
      ...config,
      chartKey,
    }),
    series: buildSeriesConfig(
      xData,
      yData,
      config,
      colors,
      purchasePoints,
      chartKey
    ),
  };
}

function getThemeColors() {
  return {
    background: isDarkMode ? "#1a1a1a" : "#fafafa",
    text: isDarkMode ? "#fafafa" : "#333333",
    border: isDarkMode ? "#555555" : "#cccccc",
    tooltipBg: isDarkMode ? "#333333" : "#fafafa",
    tooltipBorder: isDarkMode ? "#555555" : "#cccccc",
  };
}

function buildTooltipConfig(config, chartKey) {
  const colors = getThemeColors();

  const tooltipTexts = {
    chart1: "",
    chart2: getTranslation("otherValue"),
    chart3: getTranslation("btcPrice"),
    chart5: getTranslation("btcPrice"),
    chart6: getTranslation("btcYield"),
    chart7: getTranslation("btcGain"),
    chart8: getTranslation("btcUsdGain"),
    chart9: getTranslation("bitcoinPerThousand"),
    chart10: getTranslation("btcPrice"),
    chart12: getTranslation("btcPrice"),
    chart13: "",
  };

  return {
    trigger: "axis",
    backgroundColor: colors.tooltipBg,
    borderColor: colors.tooltipBorder,
    textStyle: {
      color: colors.text,
    },
    formatter: function (params) {
      const mainParams = params.filter(
        (p) => !p.seriesName.includes("Compras")
      );
      if (mainParams.length === 0) return "";

      const param = mainParams[0];
      const value = param.value;
      const formatConfig = config.numberFormat
        ? config.numberFormat.tooltip
        : null;
      const currencyConfig = config.currency;

      let formattedValue;

      if (chartKey === "chart5" || chartKey === "chart12") {
        const locale =
          formatConfig && formatConfig.locale
            ? formatConfig.locale
            : LanguageManager.currentLanguage;
        formattedValue = Math.round(value).toLocaleString(locale);
        if (formatConfig && formatConfig.prefix) {
          formattedValue = formatConfig.prefix + formattedValue;
        }
      } else {
        if (
          param &&
          param.data &&
          typeof param.data === "object" &&
          param.data.original
        ) {
          formattedValue = applyOriginalStringTransform(
            param.data.original,
            formatConfig
          );
        }
        if (formattedValue === undefined) {
          formattedValue = formatNumber(value, formatConfig, currencyConfig);
        }
      }
      const labelText = tooltipTexts[chartKey] || "";

      return `${param.name}<br/>${labelText} ${formattedValue}`;
    },
  };
}

function buildXAxisConfig(xData, colors, chartType, config = {}) {
  const baseConfig = {
    data: xData,
    axisLabel: {
      color: colors.text,
      margin: 15,
      align: "center",
      verticalAlign: "top",
      rotate: 0,
      offset: [0, 5],
      fontSize: 11,
      overflow: "truncate",
      width: 70,
      hideOverlap: false,
    },
    axisLine: {
      lineStyle: {
        color: colors.border,
      },
    },
  };

  if (config.xAxisOptions?.boundaryGap !== undefined) {
    baseConfig.boundaryGap = config.xAxisOptions.boundaryGap;
  }
  if (config.xAxisOptions?.scale !== undefined) {
    baseConfig.scale = config.xAxisOptions.scale;
  }
  if (config.dateFormat?.enabled) {
    baseConfig.axisLabel.formatter = (value, index) => {
      if (!value) return "";

      if (typeof value === "string" && value.includes("/")) {
        const parts = value.split("/");
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          let year = parseInt(parts[2]);

          if (year < 100) {
            year = 2000 + year;
          }

          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            return LanguageManager.formatDate(date, config.dateFormat.format);
          }
        }
      }

      if (
        typeof value === "string" &&
        value.includes("-") &&
        value.includes("T")
      ) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return LanguageManager.formatDate(date, config.dateFormat.format);
        }
      }

      if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return LanguageManager.formatDate(date, config.dateFormat.format);
        }
      }

      return value;
    };
  }

  if (chartType === "bar") {
    baseConfig.axisLabel.interval = 0;
    if (config.hideYAxis) {
      baseConfig.axisLabel.align = "center";
      baseConfig.axisLabel.offset = [0, 0];
    }
  } else {
    const isIsoDate =
      xData.length > 0 &&
      typeof xData[0] === "string" &&
      xData[0].includes("-") &&
      (xData[0].includes("T") || xData[0].match(/^\d{4}-\d{2}-\d{2}$/));
    const isDdMmYyyyDate =
      xData.length > 0 &&
      typeof xData[0] === "string" &&
      (/^\d{2}\/\d{2}\/\d{4}$/.test(xData[0]) ||
        /^\d{2}\/\d{2}\/\d{2}$/.test(xData[0]));
    const isDateData = isIsoDate || isDdMmYyyyDate;

    if (isDateData) {
      if (config.chartKey === "dataTable") {
        // console.log("dataTable", xData);
        // console.log("config:", config);

        const validIndices = [];
        for (let i = xData.length - 1; i >= 0; i--) {
          if (xData[i] && xData[i].toString().trim() !== "") {
            validIndices.push(i);
          }
        }

        const selectedIndices = [];
        const usedMonths = new Set();

        for (
          let i = 0;
          i < validIndices.length && selectedIndices.length < 3;
          i++
        ) {
          const index = validIndices[i];
          const value = xData[index];

          let date;
          if (isDdMmYyyyDate) {
            const parts = value.split("/");
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            date = new Date(year, month - 1, day);
          } else {
            const datePart = value.split("T")[0];
            date = new Date(datePart);
          }

          if (isNaN(date.getTime())) continue;

          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

          if (!usedMonths.has(monthKey)) {
            selectedIndices.push(index);
            usedMonths.add(monthKey);
          }
        }

        baseConfig.axisLabel.interval = (index, value) => {
          return selectedIndices.includes(index);
        };

        baseConfig.axisLabel.formatter = (value, index) => {
          if (!selectedIndices.includes(index)) return "";

          let date;
          if (isDdMmYyyyDate) {
            const parts = value.split("/");
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            date = new Date(year, month - 1, day);
          } else {
            const datePart = value.split("T")[0];
            date = new Date(datePart);
          }

          if (isNaN(date.getTime())) return value;

          return LanguageManager.formatDate(date, "monthYear");
        };

        return baseConfig;
      }
      if (config.showAllLabels) {
        baseConfig.axisLabel.interval = 0;
        return baseConfig;
      }

      if (config.showQuarterlyLabels) {
        if (xData.length < 5) {
          baseConfig.axisLabel.interval = 0;
          baseConfig.axisLabel.formatter = (value, index) => {
            let date;
            if (isDdMmYyyyDate) {
              const parts = value.split("/");
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]);
              const year = parseInt(parts[2]);
              date = new Date(year, month - 1, day);
            } else {
              const datePart = value.split("T")[0];
              date = new Date(datePart);
            }

            if (isNaN(date.getTime())) return value;

            return LanguageManager.formatDate(date, "monthYear");
          };
          return baseConfig;
        }

        const quarterlyIndices = [];
        let currentQuarter = null;
        let currentYear = null;

        for (let i = 0; i < xData.length; i++) {
          let date;
          if (isDdMmYyyyDate) {
            const parts = xData[i].split("/");
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            date = new Date(year, month - 1, day);
          } else {
            const datePart = xData[i].split("T")[0];
            date = new Date(datePart);
          }

          if (isNaN(date.getTime())) continue;

          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const quarter = Math.ceil(month / 3);

          if (quarter !== currentQuarter || year !== currentYear) {
            currentQuarter = quarter;
            currentYear = year;

            if (month === 1 || month === 4 || month === 7 || month === 10) {
              quarterlyIndices.push(i);
            }
          }
        }

        if (config.dateInterval) {
          const interval = config.dateInterval;
          const filteredIndices = quarterlyIndices.filter(
            (_, index) => index % interval === 0
          );

          baseConfig.axisLabel.interval = (index, value) => {
            return filteredIndices.includes(index);
          };
        } else {
          baseConfig.axisLabel.interval = (index, value) => {
            return quarterlyIndices.includes(index);
          };
        }

        baseConfig.axisLabel.formatter = (value, index) => {
          let date;
          if (isDdMmYyyyDate) {
            const parts = value.split("/");
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            date = new Date(year, month - 1, day);
          } else {
            const datePart = value.split("T")[0];
            date = new Date(datePart);
          }

          if (isNaN(date.getTime())) return value;

          return LanguageManager.formatDate(date, "monthYear");
        };
      } else if (config.showCustomIntervalLabels) {
        const selectedIndices = [];
        const totalPoints = xData.length;

        selectedIndices.push(0);
        if (totalPoints > 1) {
          selectedIndices.push(totalPoints - 1);
        }

        if (totalPoints > 3) {
          if (totalPoints >= 6) {
            const firstThird = Math.floor(totalPoints / 3);
            const secondThird = Math.floor((totalPoints * 2) / 3);

            if (firstThird > 0 && firstThird < totalPoints - 1) {
              selectedIndices.push(firstThird);
            }
            if (secondThird > firstThird && secondThird < totalPoints - 1) {
              selectedIndices.push(secondThird);
            }
          } else {
            const middle = Math.floor(totalPoints / 2);
            if (middle > 0 && middle < totalPoints - 1) {
              selectedIndices.push(middle);
            }
          }
        }

        const uniqueIndices = [...new Set(selectedIndices)].sort(
          (a, b) => a - b
        );
        const finalIndices = uniqueIndices.slice(0, 4);

        baseConfig.axisLabel.interval = (index, value) => {
          return finalIndices.includes(index);
        };

        baseConfig.axisLabel.formatter = (value, index) => {
          if (!finalIndices.includes(index)) return "";
          return value;
        };
      } else if (config.showFixedIntervalLabels) {
        const interval = config.showFixedIntervalLabels;
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const fixedIndices = [];
        const targetMonths = [];

        for (let i = 0; i < xData.length; i++) {
          let date;
          if (isDdMmYyyyDate) {
            const parts = xData[i].split("/");
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            date = new Date(year, month - 1, day);
          } else {
            const datePart = xData[i].split("T")[0];
            date = new Date(datePart);
          }

          if (isNaN(date.getTime())) continue;

          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const monthKey = `${year}-${month}`;

          if (!targetMonths.includes(monthKey)) {
            targetMonths.push(monthKey);

            let targetMonth = currentMonth;
            let targetYear = currentYear;
            let monthCount = 0;

            while (targetMonth !== month || targetYear !== year) {
              monthCount++;
              targetMonth--;
              if (targetMonth === 0) {
                targetMonth = 12;
                targetYear--;
              }
              if (monthCount > 12) break;
            }

            if (monthCount % interval === 0) {
              fixedIndices.push(i);
            }
          }
        }

        baseConfig.axisLabel.interval = (index, value) => {
          return fixedIndices.includes(index);
        };

        baseConfig.axisLabel.formatter = (value, index) => {
          if (!fixedIndices.includes(index)) return "";

          let date;
          if (isDdMmYyyyDate) {
            const parts = value.split("/");
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            date = new Date(year, month - 1, day);
          } else {
            const datePart = value.split("T")[0];
            date = new Date(datePart);
          }

          if (isNaN(date.getTime())) return value;

          return LanguageManager.formatDate(date, "monthYear");
        };
      } else if (config.dateInterval) {
        const interval = config.dateInterval;
        baseConfig.axisLabel.interval = (index, value) => {
          return index % interval === 0;
        };
      } else {
        baseConfig.axisLabel.interval = "auto";
      }
    } else {
      const uniqueMonths = [];
      const monthMap = {
        jan: 1,
        fev: 2,
        mar: 3,
        abr: 4,
        mai: 5,
        jun: 6,
        jul: 7,
        ago: 8,
        set: 9,
        out: 10,
        nov: 11,
        dez: 12,
      };

      for (let i = 0; i < xData.length; i++) {
        if (i === 0 || xData[i] !== xData[i - 1]) {
          const month = xData[i].split(".")[0];
          const monthNum = monthMap[month];
          uniqueMonths.push({
            index: i,
            month: month,
            monthNum: monthNum,
            value: xData[i],
          });
        }
      }

      const quarterMonths = uniqueMonths.filter(
        (item) =>
          item.monthNum === 1 ||
          item.monthNum === 4 ||
          item.monthNum === 7 ||
          item.monthNum === 10
      );

      const showIndices = new Set(quarterMonths.map((item) => item.index));

      baseConfig.axisLabel.interval = (index, value) => {
        return showIndices.has(index);
      };
    }
  }

  return baseConfig;
}

function buildYAxisConfig(colors, config) {
  if (config.hideYAxis) {
    return {
      show: false,
      position: "right",
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    };
  }

  const yAxisConfig = {
    type: "value",
    position: "right",
    axisLabel: {
      color: colors.text,
      formatter: (value) => {
        if (
          config.chartKey === "chart5" ||
          config.chartKey === "chart12" ||
          config.chartKey === "chart13"
        ) {
          if (config.chartKey === "chart13") {
            if (value >= 1000000000) {
              const billions = Math.round(value / 1000000000);
              return "$ " + billions + "B";
            } else if (value >= 1000000) {
              const millions = Math.round(value / 1000000);
              return "$ " + millions + "M";
            } else if (value >= 1000) {
              const thousands = Math.round(value / 1000);
              return "$ " + thousands + "K";
            } else {
              return "$ " + Math.round(value).toString();
            }
          }

          if (config.chartKey === "chart12") {
            const formatConfig = config.numberFormat
              ? config.numberFormat.axis
              : null;
            const locale =
              formatConfig && formatConfig.locale
                ? formatConfig.locale
                : "en-US";
            return `$ ${Math.round(value).toLocaleString(locale)}`;
          }

          if (config.chartKey === "chart5") {
            const formatConfig = config.numberFormat
              ? config.numberFormat.axis
              : null;
            const locale =
              formatConfig && formatConfig.locale
                ? formatConfig.locale
                : LanguageManager.currentLanguage;
            return `$ ${Math.round(value).toLocaleString(locale)}`;
          }

          return `$ ${Math.round(value).toLocaleString("en-US")}`;
        }

        const formatConfig = config.numberFormat
          ? config.numberFormat.axis
          : null;
        const currencyConfig = config.currency;
        return formatNumber(value, formatConfig, currencyConfig);
      },
    },
    axisLine: {
      lineStyle: {
        color: colors.border,
      },
    },
    splitLine: {
      show: false,
    },
  };

  if (config.yAxis && config.yAxis.min !== undefined) {
    yAxisConfig.min = config.yAxis.min;
  }

  if (config.min !== undefined) {
    yAxisConfig.min = config.min;
  }

  if (config.yAxisOptions) {
    Object.assign(yAxisConfig, config.yAxisOptions);
  }

  if (yAxisConfig.min !== undefined) {
    if (yAxisConfig.scale !== false) {
      yAxisConfig.min = Math.max(0, yAxisConfig.min * 0.95);
    }

    if (yAxisConfig.max === undefined) {
      yAxisConfig.max = yAxisConfig.min * 1.5;
    }

    if (yAxisConfig.splitNumber === undefined) {
      yAxisConfig.splitNumber = 5;
    }
  }

  return yAxisConfig;
}

function calculateBitcoinNav(
  marketCapDates,
  btcHoldingsDates,
  btcHoldingsValues,
  bitcoinDates,
  bitcoinPrices
) {
  const purchasesByDate = new Map();

  for (let i = 0; i < btcHoldingsDates.length; i++) {
    const holdingsDateStr = btcHoldingsDates[i];
    const holdingsValue = btcHoldingsValues[i] || 0;

    if (!holdingsDateStr || holdingsValue === 0) continue;

    let normalizedHoldingsDate;
    if (holdingsDateStr.includes("/")) {
      const parts = holdingsDateStr.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        let year = parts[2];
        if (year.length === 2) {
          year = "20" + year;
        }
        normalizedHoldingsDate = `${year}-${month}-${day}`;
      }
    } else {
      normalizedHoldingsDate = holdingsDateStr;
    }

    if (!normalizedHoldingsDate) continue;

    purchasesByDate.set(normalizedHoldingsDate, holdingsValue);
  }

  const bitcoinNavValues = [];

  let firstBitcoinDate = null;
  if (btcHoldingsDates.length > 0) {
    const firstDateStr = btcHoldingsDates[0];
    if (firstDateStr && firstDateStr.includes("/")) {
      const parts = firstDateStr.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        let year = parts[2];
        if (year.length === 2) {
          year = "20" + year;
        }
        firstBitcoinDate = new Date(`${year}-${month}-${day}`).getTime();
      }
    } else if (firstDateStr && firstDateStr.includes("-")) {
      firstBitcoinDate = new Date(firstDateStr.split("T")[0]).getTime();
    }
  }

  if (!firstBitcoinDate) {
    firstBitcoinDate = new Date("2025-01-17").getTime();
  }

  let currentBtcHoldings = 0;

  for (let i = 0; i < marketCapDates.length; i++) {
    const marketCapDate = marketCapDates[i];
    const normalizedMarketCapDate = marketCapDate.includes("T")
      ? marketCapDate.split("T")[0]
      : marketCapDate;

    let searchDate = normalizedMarketCapDate;
    if (marketCapDate.includes("/")) {
      const parts = marketCapDate.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        let year = parts[2];
        if (year.length === 2) {
          year = "20" + year;
        }
        searchDate = `${year}-${month}-${day}`;
      }
    }

    const currentDate = new Date(searchDate).getTime();

    if (currentDate < firstBitcoinDate) {
      bitcoinNavValues.push(0);
      continue;
    }

    if (purchasesByDate.has(searchDate)) {
      currentBtcHoldings = purchasesByDate.get(searchDate);
    }

    let btcPrice = 0;

    for (let k = 0; k < bitcoinDates.length; k++) {
      const bitcoinDateStr = bitcoinDates[k];
      const normalizedBitcoinDate = bitcoinDateStr.includes("T")
        ? bitcoinDateStr.split("T")[0]
        : bitcoinDateStr;

      if (normalizedBitcoinDate === searchDate) {
        btcPrice = bitcoinPrices[k] || 0;
        break;
      }
    }

    if (btcPrice === 0) {
      let closestPriceIndex = -1;
      let smallestDiff = Infinity;

      for (let k = 0; k < bitcoinDates.length; k++) {
        const bitcoinDateStr = bitcoinDates[k];
        const normalizedBitcoinDate = bitcoinDateStr.includes("T")
          ? bitcoinDateStr.split("T")[0]
          : bitcoinDateStr;

        const bitcoinTime = new Date(normalizedBitcoinDate).getTime();
        const diff = Math.abs(currentDate - bitcoinTime);

        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestPriceIndex = k;
        }
      }

      if (closestPriceIndex !== -1) {
        btcPrice = bitcoinPrices[closestPriceIndex] || 0;
      }
    }

    const navValue = currentBtcHoldings * btcPrice;
    bitcoinNavValues.push(navValue);
  }

  return bitcoinNavValues;
}

function buildSeriesConfig(
  xData,
  yData,
  config,
  colors,
  purchasePoints,
  chartKey
) {
  const series = [];
  const style = config.style;

  const hasPreservedFormat =
    yData.length > 0 &&
    typeof yData[0] === "object" &&
    yData[0].hasOwnProperty("value");
  const chartData = hasPreservedFormat
    ? yData.map((item) => item.value)
    : yData;
  const originalLabels = hasPreservedFormat
    ? yData.map((item) => item.original)
    : null;

  const seriesConfig = {
    name: "Close",
    type: config.chartType,
    data: config.chartType === "bar" && hasPreservedFormat ? yData : chartData,
  };

  if (config.chartType === "bar") {
    seriesConfig.itemStyle = {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: style.color,
        },
        {
          offset: 1,
          color: colors.background,
        },
      ]),
      opacity: 0.8,
      borderRadius: [2, 2, 0, 0],
    };

    if (config.hideYAxis) {
      seriesConfig.barWidth = "50%";
    }
    seriesConfig.emphasis = {
      itemStyle: {
        opacity: 1,
      },
    };
    seriesConfig.label = {
      show: true,
      position: "top",
      formatter: (params) => {
        if (originalLabels && originalLabels[params.dataIndex]) {
          return applyOriginalStringTransform(
            originalLabels[params.dataIndex],
            config.numberFormat ? config.numberFormat.labels : null
          );
        }
        if (
          Array.isArray(config.bars) &&
          typeof params.data === "object" &&
          params.data.original
        ) {
          return applyOriginalStringTransform(
            params.data.original,
            config.numberFormat ? config.numberFormat.labels : null
          );
        }

        const formatConfig = config.numberFormat
          ? config.numberFormat.labels
          : null;
        const currencyConfig = config.currency;
        return formatNumber(params.value, formatConfig, currencyConfig);
      },
      color: colors.text,
      fontSize: 12,
    };
  } else {
    seriesConfig.lineStyle = {
      width: 1,
      color: style.color,
    };
    seriesConfig.showSymbol = style.showSymbol;
    seriesConfig.smooth = style.smooth;
    seriesConfig.areaStyle = style.areaStyle
      ? {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: style.color,
            },
            {
              offset: 1,
              color: colors.background,
            },
          ]),
        }
      : undefined;
  }

  series.push(seriesConfig);

  if (purchasePoints.length > 0 && config.purchaseStyle) {
    series.push({
      name: "Compras",
      type: "scatter",
      data: purchasePoints,
      symbolSize: config.purchaseStyle.symbolSize,
      symbol: config.purchaseStyle.symbol,
      itemStyle: {
        color: config.purchaseStyle.color,
        borderColor: "#ffffff",
        borderWidth: 2,
        shadowColor: config.purchaseStyle.color,
        shadowBlur: 5,
      },
      emphasis: {
        scale: 1.5,
        itemStyle: {
          color: "#FFD700",
          borderColor: "#ffffff",
          borderWidth: 3,
          shadowColor: "#FFD700",
          shadowBlur: 15,
        },
      },
      tooltip: {
        show: true,
        trigger: "item",
        formatter: function (params) {
          const purchaseValue = params.data.purchaseValue || "N/A";
          const xIndex = params.data.value[0];
          const xValue = xData[xIndex] || "N/A";
          const cleanPurchaseValue = purchaseValue.replace(/^\$/, "");
          const purchaseText = getTranslation("btcPurchase");
          return `${purchaseText}<br/>${xValue}<br/>${cleanPurchaseValue}`;
        },
      },
      z: 10,
    });
  }

  return series;
}

function buildHybridMarketCapChartOption(
  xData,
  marketCapValues,
  bitcoinXData,
  bitcoinValues,
  config,
  chartKey
) {
  const colors = getThemeColors();

  return {
    backgroundColor: colors.background,
    tooltip: {
      trigger: "axis",
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: {
        color: colors.text,
      },
      formatter: function (params) {
        if (!params || params.length === 0) return "";

        let result = `${params[0].name}<br/>`;

        params.forEach((param) => {
          if (param.value !== null && param.value !== undefined) {
            const formatConfig = config.numberFormat?.tooltip || {};
            const formattedValue = LanguageManager.formatNumber(param.value, {
              decimals: formatConfig.decimals || 2,
              prefix: formatConfig.prefix || "$ ",
              suffix: formatConfig.suffix || "",
              useGrouping: formatConfig.useGrouping !== false,
              abbreviate: formatConfig.abbreviate || true,
              abbreviateType: formatConfig.abbreviateType || "short",
              locale: formatConfig.locale || LanguageManager.currentLanguage,
            });

            let label = "";
            if (param.seriesName === "Market Cap") {
              label = "Market Cap:";
            } else if (param.seriesName === "Bitcoin NAV") {
              label = "Bitcoin NAV:";
            }

            result += `${param.marker} ${label} ${formattedValue}<br/>`;
          }
        });

        return result;
      },
    },
    legend: {
      data: ["Market Cap", "Bitcoin NAV"],
      textStyle: {
        color: colors.text,
      },
      bottom: 10,
      left: "center",
    },
    grid: {
      left: "6%",
      right: "6%",
      bottom: "25%",
      top: "10%",
      height: "65%",
      containLabel: true,
    },
    xAxis: buildXAxisConfig(xData, colors, config.chartType, {
      ...config,
      chartKey,
    }),
    yAxis: buildYAxisConfig(colors, {
      ...config,
      chartKey,
    }),
    series: [
      {
        name: "Market Cap",
        type: "line",
        data: marketCapValues,
        lineStyle: {
          width: 2,
          color: config.style.marketCap.color,
        },
        itemStyle: {
          color: config.style.marketCap.color,
        },
        showSymbol: config.style.marketCap.showSymbol,
        smooth: config.style.marketCap.smooth,
        areaStyle: config.style.marketCap.areaStyle
          ? {
              opacity: 0.3,
              color: config.style.marketCap.color,
            }
          : undefined,
        connectNulls: false,
      },
      {
        name: "Bitcoin NAV",
        type: "line",
        data: bitcoinValues,
        lineStyle: {
          width: 2,
          color: config.style.bitcoinNav.color,
        },
        itemStyle: {
          color: config.style.bitcoinNav.color,
        },
        showSymbol: config.style.bitcoinNav.showSymbol,
        smooth: config.style.bitcoinNav.smooth,
        areaStyle: config.style.bitcoinNav.areaStyle
          ? {
              opacity: 0.3,
              color: config.style.bitcoinNav.color,
            }
          : undefined,
        connectNulls: false,
      },
    ],
  };
}

function formatNumber(value, formatConfig, currencyConfig) {
  const options = {
    decimals: formatConfig?.decimals || 2,
    prefix: formatConfig?.prefix || "",
    suffix: formatConfig?.suffix || "",
    useGrouping: formatConfig?.useGrouping !== false,
    abbreviate: formatConfig?.abbreviate || false,
    abbreviateType: formatConfig?.abbreviateType || "long",
  };

  if (formatConfig?.locale) {
    options.locale = formatConfig.locale;
  }

  if (currencyConfig) {
    if (currencyConfig.type === "bitcoin") {
      options.currency = "bitcoin";
    } else if (currencyConfig.type === "dollar") {
      options.currency = "dollar";
    } else if (currencyConfig.type === "percent") {
      options.currency = "percent";
    }
  }

  return LanguageManager.formatNumber(value, options);
}

function applyOriginalStringTransform(original, formatConfig) {
  if (!original) return original;
  if (!formatConfig || !formatConfig.transform) return original;

  const t = formatConfig.transform;
  let output = original;

  if (t.preserveOriginal) {
    const locale = formatConfig.locale || LanguageManager.currentLanguage;
    const numericValue = parseFloat(
      original.toString().replace(/[^\d.-]/g, "")
    );

    if (!isNaN(numericValue)) {
      if (locale === "pt-BR") {
        return numericValue.toLocaleString("pt-BR", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          useGrouping: true,
        });
      } else {
        return numericValue.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          useGrouping: true,
        });
      }
    }
  }

  if (t.replaceCommaWithDot) {
    output = output.replace(/(\d),(\d)/g, "$1.$2");
  }

  if (t.replaceDotWithComma) {
    output = output.replace(/(\d)\.(\d)/g, "$1,$2");
  }

  return output;
}

function getCurrentValue(chartKey) {
  const config = chartsConfig[chartKey];
  if (!config || config.type !== "csv" || !chartData[chartKey]) {
    return "0";
  }

  const columnData = chartData[chartKey][config.currentValueHTML];
  if (!columnData || columnData[config.currentValuePosition] === undefined) {
    return "0";
  }

  const rawValue = columnData[config.currentValuePosition];
  const label = config.label || "";

  return label + rawValue.toString();
}

function updateCurrentValues() {
  const currentValueElements = document.querySelectorAll(".current-value");

  currentValueElements.forEach((element, index) => {
    const chartKey = `chart${index + 1}`;
    const config = chartsConfig[chartKey];

    if (config && config.type === "csv") {
      const value = getCurrentValue(chartKey);
      element.textContent = value;
    }
  });
}

async function getSimpleCurrentValue(elementId) {
  const config = simpleValuesConfig[elementId];
  if (!config) return "00,00";

  if (config.type === "calculated") {
    if (config.calculation === "multiply") {
      let btcCountData = getGidData(config.btcCountConfig.gid);
      if (!btcCountData) {
        btcCountData = await loadGidData(config.btcCountConfig.gid);
        if (!btcCountData) return "00,00";
      }

      const columnData = btcCountData[config.btcCountConfig.currentValueHTML];
      if (!columnData || columnData.length === 0) return "00,00";

      const lastIndex = columnData.length - 1;
      const btcCountRaw = columnData[lastIndex];
      const btcCountCleaned = btcCountRaw
        .toString()
        .replace(/[^\d,.-]/g, "")
        .replace(",", ".");
      const btcCount = parseFloat(btcCountCleaned);

      if (isNaN(btcCount) || btcCount <= 0) return "00,00";

      const apiData = await loadApiSimpleData(config.btcPriceConfig);
      if (!apiData) return "00,00";

      const btcPrice = extractApiSimpleValue(apiData, config.btcPriceConfig);
      if (btcPrice === null || btcPrice === undefined) return "00,00";

      const numericPrice =
        typeof btcPrice === "number" ? btcPrice : parseFloat(btcPrice);
      if (isNaN(numericPrice) || numericPrice <= 0) return "00,00";

      const navValue = btcCount * numericPrice;

      if (config.numberFormat) {
        const formattedValue = LanguageManager.formatNumber(navValue, {
          decimals: config.numberFormat.decimals || 2,
          prefix: config.numberFormat.prefix || "",
          suffix: config.numberFormat.suffix || "",
          useGrouping: config.numberFormat.useGrouping !== false,
          abbreviate: config.numberFormat.abbreviate || false,
          abbreviateType: config.numberFormat.abbreviateType || "long",
        });
        return `<span class="value-number">${formattedValue}</span>`;
      }

      return `<span class="value-number">${navValue.toLocaleString(
        "pt-BR"
      )}</span>`;
    }
    return "00,00";
  }

  if (config.type === "api") {
    const apiData = await loadApiSimpleData(config);
    if (!apiData) return "00,00";

    const rawValue = extractApiSimpleValue(apiData, config);
    if (rawValue === null || rawValue === undefined) return "00,00";

    if (config.numberFormat) {
      const numericValue =
        typeof rawValue === "number" ? rawValue : parseFloat(rawValue);

      if (!isNaN(numericValue)) {
        let valueToFormat = numericValue;

        if (config.numberFormat.multiplyBy100) {
          valueToFormat = numericValue * 100;
        }

        if (config.numberFormat.decimals === 0) {
          valueToFormat = Math.round(valueToFormat);
        }

        let decimalsToUse = config.numberFormat.decimals || 2;
        if (elementId === "value-bitcoin-price") {
          decimalsToUse = 0;
        }

        let formattedValue = LanguageManager.formatNumber(valueToFormat, {
          decimals: decimalsToUse,
          prefix: config.numberFormat.prefix || "",
          suffix: config.numberFormat.suffix || "",
          useGrouping: config.numberFormat.useGrouping !== false,
          locale: config.numberFormat.locale,
          abbreviate: config.numberFormat.abbreviate || false,
          abbreviateType: config.numberFormat.abbreviateType || "long",
        });

        if (config.numberFormat.transform) {
          formattedValue = applyOriginalStringTransform(
            formattedValue,
            config.numberFormat
          );
        }

        if (
          config.numberFormat.decimals === 0 ||
          elementId === "value-bitcoin-price"
        ) {
          formattedValue = formattedValue
            .replace(/\.00%$/, "%")
            .replace(/,00%$/, "%")
            .replace(/\.00$/, "")
            .replace(/,00$/, "");
        }

        return `<span class="value-number">${formattedValue}</span>`;
      }
    }

    return `<span class="value-number">${rawValue.toString()}</span>`;
  }

  let csvData = getGidData(config.gid);
  if (!csvData) {
    csvData = await loadGidData(config.gid);
    if (!csvData) return "00,00";
  }

  //  if (elementId === "value-bitcoin-count") {
  //   console.log("teste",  csvData);
  // }

  const columnData = csvData[config.currentValueHTML];
  if (!columnData || columnData[config.currentValuePosition] === undefined)
    return "00,00";

  const rawValue = columnData[config.currentValuePosition];
  const label = config.label || "";
  const labelPosition = config.labelPosition || "before";

  if (config.numberFormat) {
    if (config.numberFormat.transform) {
      const transformed = applyOriginalStringTransform(
        rawValue.toString(),
        config.numberFormat
      );
      if (labelPosition === "after") {
        return `<span class="value-number">${transformed}</span><span class="value-label">${label}</span>`;
      } else {
        return `<span class="value-label">${label}</span><span class="value-number">${transformed}</span>`;
      }
    }

    let numericString = rawValue.toString().replace(/[₿$R€£¥\s%]/g, "");
    const lastDot = numericString.lastIndexOf(".");
    const lastComma = numericString.lastIndexOf(",");
    if (lastDot !== -1 && lastComma !== -1) {
      if (lastComma > lastDot) {
        numericString = numericString.replace(/\./g, "").replace(/,/g, ".");
      } else {
        numericString = numericString.replace(/,/g, "");
      }
    } else if (lastComma !== -1) {
      numericString = numericString.replace(/\./g, "").replace(/,/g, ".");
    } else {
      numericString = numericString.replace(/,/g, "");
    }
    const numericValue = parseFloat(numericString);

    if (!isNaN(numericValue)) {
      let formattedValue = LanguageManager.formatNumber(numericValue, {
        decimals: config.numberFormat.decimals || 0,
        prefix: config.numberFormat.prefix || "",
        suffix: config.numberFormat.suffix || "",
        useGrouping: config.numberFormat.useGrouping !== false,
        locale: config.numberFormat.locale,
      });

      if (config.numberFormat.transform) {
        formattedValue = applyOriginalStringTransform(
          formattedValue,
          config.numberFormat
        );
      }

      if (labelPosition === "after") {
        return `<span class="value-number">${formattedValue}</span><span class="value-label">${label}</span>`;
      } else {
        return `<span class="value-label">${label}</span><span class="value-number">${formattedValue}</span>`;
      }
    }
  }

  if (labelPosition === "after") {
    return `<span class="value-number">${rawValue.toString()}</span><span class="value-label">${label}</span>`;
  } else {
    return `<span class="value-label">${label}</span><span class="value-number">${rawValue.toString()}</span>`;
  }
}

async function updateSimpleCurrentValues() {
  const promises = Object.keys(simpleValuesConfig).map(async (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const value = await getSimpleCurrentValue(elementId);
      element.innerHTML = value;
    }
  });

  await Promise.all(promises);
  await updateVariationsFromAPI();

  const allCards = document.querySelectorAll(".cards");
  allCards.forEach((card) => {
    const loadingElement = card.querySelector(".cards-loading");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  });
}

async function updateVariationsFromAPI() {
  const variationElements = document.querySelectorAll('[id^="var-"]');

  for (const element of variationElements) {
    const elementId = element.id;
    const config = simpleValuesConfig[elementId];

    if (config && config.type === "api") {
      try {
        const apiData = await loadApiSimpleData(config);
        if (apiData && apiData.structured && apiData.structured.cotacaoAtual) {
          const cotacao = apiData.structured.cotacaoAtual;
          if (
            cotacao[config.field] !== undefined &&
            cotacao[config.field] !== null
          ) {
            const variationValue = parseFloat(cotacao[config.field]);
            let formattedValue = formatNumber(
              variationValue,
              config.numberFormat
            );
            if (config.numberFormat && config.numberFormat.transform) {
              formattedValue = applyOriginalStringTransform(
                formattedValue,
                config.numberFormat
              );
            }
            element.innerHTML = formattedValue;
            element.className =
              variationValue >= 0
                ? "positive arrow-positive"
                : "negative arrow-negative";
            continue;
          }
        }
      } catch (error) {
        console.error(`Error loading variation for ${elementId}:`, error);
      }
    }

    const currentText = element.innerHTML;
    const cleanValue = currentText
      .replace(/[₿$R€£¥\s%]/g, "")
      .replace(",", ".");
    const variationValue = parseFloat(cleanValue);

    if (!isNaN(variationValue)) {
      element.className =
        variationValue >= 0
          ? "positive arrow-positive"
          : "negative arrow-negative";
    } else {
      element.className = "positive arrow-positive";
    }
  }
}

function showCardsLoading() {
  const cardsLoadingElements = document.querySelectorAll(".cards-loading");
  cardsLoadingElements.forEach((element) => {
    element.style.display = "flex";
  });
}

function hideCardsLoading() {
  const cardsLoadingElements = document.querySelectorAll(".cards-loading");
  cardsLoadingElements.forEach((element) => {
    element.style.display = "none";
  });
}

let apiSimpleData = {};

async function loadApiSimpleData(config) {
  const cacheKey = config.apiData;
  if (apiSimpleData[cacheKey]) return apiSimpleData[cacheKey];

  // Verificar se existem dados fictícios disponíveis
  if (window.mockChartData) {
    if (config.apiData && config.apiData.includes("codigo=CASH3")) {
      return window.mockChartData.chart10;
    }
    if (config.apiData && config.apiData.includes("codigo=MLIZY")) {
      return window.mockChartData.chart11;
    }
    if (config.apiData && config.apiData.includes("codigo=BTCUSDTBIN")) {
      return window.mockChartData.chart12;
    }
  }

  const directUrl = CHART_CONFIG.API_BASE_URL + config.apiData;
  const proxiedUrl = CHART_CONFIG.CORS_PROXY + encodeURIComponent(directUrl);

  try {
    const response = await fetch(proxiedUrl);
    if (!response.ok) return null;

    const responseText = await response.text();

    try {
      const jsonData = JSON.parse(responseText);

      const columnData = {
        structured: parseApiJsonData(jsonData),
        jsonData: jsonData,
      };

      apiSimpleData[cacheKey] = columnData;
      return columnData;
    } catch (jsonError) {
      const lines = responseText.trim().split(/\r?\n/);
      const rows = lines
        .filter((line) => line.trim())
        .map((line) => parseCsvLine(line));
      const filteredRows = rows.filter((row) =>
        row.some((cell) => cell !== "")
      );

      const columnData = {};
      const maxColumns = Math.max(...filteredRows.map((row) => row.length));

      for (let j = 0; j < maxColumns; j++) {
        const columnName = j.toString();
        columnData[columnName] = [];

        for (let i = 0; i < filteredRows.length; i++) {
          const value = filteredRows[i][j];
          if (value !== undefined && value !== null && value !== "") {
            const processedValue = processValue(value.toString().trim());
            columnData[columnName].push(processedValue);
          }
        }

        if (columnData[columnName].length === 0) {
          delete columnData[columnName];
        }
      }

      apiSimpleData[cacheKey] = columnData;
      return columnData;
    }
  } catch (error) {
    return null;
  }
}

function extractApiSimpleValue(apiData, config) {
  if (!apiData) return null;

  let value = null;

  if (config.dataSource === "cotacaoAtual") {
    value = apiData.structured.cotacaoAtual[config.field];
  } else if (config.dataSource === "historico" && config.getLatest) {
    if (
      apiData.jsonData?.dadosHistoricos?.Historico &&
      Array.isArray(apiData.jsonData.dadosHistoricos.Historico)
    ) {
      const historico = apiData.jsonData.dadosHistoricos.Historico;
      if (historico.length > 0 && historico[0][config.field]) {
        value = parseFloat(historico[0][config.field]) || null;
      }
    }
  }

  if (apiData.jsonData.Historico && Array.isArray(apiData.jsonData.Historico)) {
    const historico = apiData.jsonData.Historico;
    if (config.startIndex !== undefined && config.step !== undefined) {
      for (let i = config.startIndex; i < historico.length; i += config.step) {
        const item = historico[i];
        if (item && item.Ult) {
          value = parseFloat(item.Ult) || null;
          break;
        }
      }
    }
    if (value === null && historico.length > 0 && historico[0].Ult) {
      value = parseFloat(historico[0].Ult) || null;
    }
  }

  if (
    apiData.jsonData.dadosHistoricos.Historico &&
    Array.isArray(apiData.jsonData.dadosHistoricos.Historico)
  ) {
    const historico = apiData.jsonData.dadosHistoricos.Historico;
    if (config.startIndex !== undefined && config.step !== undefined) {
      for (let i = config.startIndex; i < historico.length; i += config.step) {
        const item = historico[i];
        if (item && item.Ult) {
          value = parseFloat(item.Ult) || null;
          break;
        }
      }
    }
    if (value === null && historico.length > 0 && historico[0].Ult) {
      value = parseFloat(historico[0].Ult) || null;
    }
  }

  if (value === null) {
    const source = apiData[config.dataSource];
    if (!source) return null;

    for (let i = config.startIndex; i < source.length; i += config.step) {
      const row = source[i];
      const cell = Array.isArray(row) ? row[0] : row;
      const match = cell.match(config.regex);
      if (match) {
        value = parseFloat(match[1]);
        break;
      }
    }
  }

  if (value !== null && config.calculation) {
    if (
      config.calculation.operation === "divide" &&
      config.calculation.divisor
    ) {
      value = value / config.calculation.divisor;
    }
    if (
      config.calculation.operation === "multiply" &&
      config.calculation.multiplier
    ) {
      value = value * config.calculation.multiplier;
    }
    if (
      config.calculation.operation === "custom" &&
      config.calculation.formula
    ) {
      const formula = config.calculation.formula.replace(/value/g, value);
      if (config.field === "IndicGiroFinanceiro") {
        console.log("BSE Volume Financeiro:", {
          originalValue: value,
          formula: config.calculation.formula,
          processedFormula: formula,
          result: eval(formula),
        });
      }
      value = eval(formula);
    }
  }

  return value;
}

async function loadGidData(gid) {
  if (gidData[gid]) {
    return gidData[gid];
  }

  try {
    const data = await loadCSVFromURL(CHART_CONFIG.BASE_SHEET_URL + gid);
    if (data && data.columnData) {
      gidData[gid] = data.columnData;
      return gidData[gid];
    }
  } catch (error) {}

  return null;
}

function getGidData(gid) {
  const chartWithSameGid = Object.entries(chartsConfig).find(
    ([_, chartConfig]) => chartConfig.type === "csv" && chartConfig.gid === gid
  );

  if (chartWithSameGid && chartData[chartWithSameGid[0]]) {
    return chartData[chartWithSameGid[0]];
  }

  return gidData[gid] || null;
}

async function loadCsvData(chartKey, config) {
  const data = await loadCSVFromURL(CHART_CONFIG.BASE_SHEET_URL + config.gid);
  if (data && data.columnData) {
    chartData[chartKey] = data.columnData;

    if (chartKey === "chart5") {
      const csvUrl = CHART_CONFIG.BASE_SHEET_URL + config.gid;
      chartData[chartKey].E_RAW = await loadRawColumnE(csvUrl);
    }

    createChart(chartKey);

    setTimeout(() => {
      updateCurrentValues();
      updateSimpleCurrentValues();
    }, 500);
  }
}

async function loadAllSimpleGids() {
  const uniqueGids = [
    ...new Set(Object.values(simpleValuesConfig).map((config) => config.gid)),
  ];

  const promises = uniqueGids.map(async (gid) => {
    if (!getGidData(gid)) {
      return await loadGidData(gid);
    }
    return getGidData(gid);
  });

  await Promise.all(promises);
}

async function loadAllData() {
  chartData.chart10 = {
    structured: {
      cotacaoAtual: { Ult: 8.45, Var: 2.15 },
      dadosHistoricos: [
        { Data: "2024-01-01", Ult: 8.2 },
        { Data: "2024-01-02", Ult: 8.25 },
        { Data: "2024-01-03", Ult: 8.3 },
        { Data: "2024-01-04", Ult: 8.35 },
        { Data: "2024-01-05", Ult: 8.4 },
        { Data: "2024-01-08", Ult: 8.38 },
        { Data: "2024-01-09", Ult: 8.42 },
        { Data: "2024-01-10", Ult: 8.45 },
        { Data: "2024-01-11", Ult: 8.43 },
        { Data: "2024-01-12", Ult: 8.47 },
        { Data: "2024-01-15", Ult: 8.45 },
      ],
    },
  };

  chartData.chart11 = {
    structured: {
      cotacaoAtual: { Ult: 2.2, Var: 5.25 },
      dadosHistoricos: [
        { Data: "2024-01-01", Ult: 2.1 },
        { Data: "2024-01-15", Ult: 2.2 },
      ],
    },
  };

  chartData.chart12 = {
    structured: {
      cotacaoAtual: { Ult: 67500, Var: 3.45 },
      dadosHistoricos: [
        { Data: "2024-01-01", Ult: 65200 },
        { Data: "2024-01-02", Ult: 65800 },
        { Data: "2024-01-03", Ult: 66200 },
        { Data: "2024-01-04", Ult: 66800 },
        { Data: "2024-01-05", Ult: 67100 },
        { Data: "2024-01-08", Ult: 67300 },
        { Data: "2024-01-09", Ult: 67600 },
        { Data: "2024-01-10", Ult: 67800 },
        { Data: "2024-01-11", Ult: 67500 },
        { Data: "2024-01-12", Ult: 67700 },
        { Data: "2024-01-15", Ult: 67500 },
      ],
    },
  };

  const loadingElements = document.querySelectorAll(".chart-loading");
  loadingElements.forEach((element) => {
    element.style.display = "none";
  });

  createChart("chart10");
  createChart("chart11");
  createChart("chart12");

  const cash3Element = document.getElementById("value-cash3-price");
  const mlizyElement = document.getElementById("value-mlizy-price");
  const bitcoinElement = document.getElementById("value-bitcoin-price");

  if (cash3Element) cash3Element.textContent = "R$ 8,45";
  if (mlizyElement) mlizyElement.textContent = "$ 1,85";
  if (bitcoinElement) bitcoinElement.textContent = "$ 67.500";
}

function createDataTable() {
  const config = chartsConfig.dataTable;
  const csvData = chartData.dataTable;
  const tableContainer = document.getElementById("data-table-container");
  const tableHead = document.querySelector("#data-table thead");
  const tableBody = document.querySelector("#data-table tbody");

  if (!config || !csvData || !tableContainer || !tableHead || !tableBody) {
    return;
  }

  const loadingElement = tableContainer.querySelector(".table-loading");
  if (loadingElement) loadingElement.style.display = "none";

  if (config.headers) {
    const headerDate = extractAxisData(csvData, config.headers.date);
    const headerBtcAcquisitions = extractAxisData(
      csvData,
      config.headers.btcAcquisitions
    );
    const headerAverageAcquisitionCost = extractAxisData(
      csvData,
      config.headers.averageAcquisitionCost
    );
    const headerAcquisitionCost = extractAxisData(
      csvData,
      config.headers.acquisitionCost
    );
    const headerBtcHoldings = extractAxisData(
      csvData,
      config.headers.btcHoldings
    );

    // console.log("=== HEADERS DA TABELA ===");
    // console.log("headerDate:", headerDate);
    // console.log("headerBtcAcquisitions:", headerBtcAcquisitions);
    // console.log("headerAverageAcquisitionCost:", headerAverageAcquisitionCost);
    // console.log("headerAcquisitionCost:", headerAcquisitionCost);
    // console.log("headerBtcHoldings:", headerBtcHoldings);

    tableHead.innerHTML = "";
    const headerRow = document.createElement("tr");

    const thDate = document.createElement("th");
    thDate.textContent = headerDate[0] || "Data";
    headerRow.appendChild(thDate);

    const thBtcAcq = document.createElement("th");
    thBtcAcq.textContent = headerBtcAcquisitions[0] || "BTC Acquisitions";
    headerRow.appendChild(thBtcAcq);

    const thAvgCost = document.createElement("th");
    thAvgCost.textContent =
      headerAverageAcquisitionCost[0] || "Average Acquisition Cost";
    headerRow.appendChild(thAvgCost);

    const thCost = document.createElement("th");
    thCost.textContent = headerAcquisitionCost[0] || "Acquisition Cost";
    headerRow.appendChild(thCost);

    const thHoldings = document.createElement("th");
    thHoldings.textContent = headerBtcHoldings[0] || "BTC Holdings";
    headerRow.appendChild(thHoldings);

    tableHead.appendChild(headerRow);
  }

  const dates = extractAxisData(csvData, config.columns.date);
  const btcAcquisitions = extractAxisData(
    csvData,
    config.columns.btcAcquisitions
  );
  const averageAcquisitionCost = extractAxisData(
    csvData,
    config.columns.averageAcquisitionCost
  );
  const acquisitionCost = extractAxisData(
    csvData,
    config.columns.acquisitionCost
  );
  const btcHoldings = extractAxisData(csvData, config.columns.btcHoldings);

  // console.log("=== DADOS DA TABELA ===");
  // console.log("dates:", dates);
  // console.log("btcAcquisitions:", btcAcquisitions);
  // console.log("averageAcquisitionCost:", averageAcquisitionCost);
  // console.log("acquisitionCost:", acquisitionCost);
  // console.log("btcHoldings:", btcHoldings);
  // console.log("csvData completo:", csvData);

  const minLength = Math.min(
    dates.length,
    btcAcquisitions.length,
    averageAcquisitionCost.length,
    acquisitionCost.length,
    btcHoldings.length
  );

  if (minLength === 0) {
    return;
  }

  tableBody.innerHTML = "";

  for (let i = 0; i < minLength; i++) {
    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    tdDate.textContent = dates[i] || "-";
    tr.appendChild(tdDate);

    const tdBtcAcq = document.createElement("td");
    tdBtcAcq.textContent =
      formatTableNumber(
        btcAcquisitions[i],
        (config.numberFormat || {}).btcAcquisitions
      ) || "-";
    tr.appendChild(tdBtcAcq);

    const tdAvgCost = document.createElement("td");
    tdAvgCost.textContent =
      formatTableNumber(
        averageAcquisitionCost[i],
        (config.numberFormat || {}).averageAcquisitionCost
      ) || "-";
    tr.appendChild(tdAvgCost);

    const tdCost = document.createElement("td");
    tdCost.textContent =
      formatTableNumber(
        acquisitionCost[i],
        (config.numberFormat || {}).acquisitionCost
      ) || "-";
    tr.appendChild(tdCost);

    const tdHoldings = document.createElement("td");
    tdHoldings.textContent =
      formatTableNumber(
        btcHoldings[i],
        (config.numberFormat || {}).btcHoldings
      ) || "-";
    tr.appendChild(tdHoldings);

    tableBody.appendChild(tr);
  }

  tableContainer.classList.add("loaded");
}

function extractTableData(config) {
  const csvData = chartData.dataTable;
  if (!csvData) return [];

  const tableData = [];

  const dates = extractAxisData(csvData, config.columns.date);
  const btcAcquisitions = extractAxisData(
    csvData,
    config.columns.btcAcquisitions
  );
  const averageAcquisitionCost = extractAxisData(
    csvData,
    config.columns.averageAcquisitionCost
  );
  const acquisitionCost = extractAxisData(
    csvData,
    config.columns.acquisitionCost
  );
  const btcHoldings = extractAxisData(csvData, config.columns.btcHoldings);

  const minLength = Math.min(
    dates.length,
    btcAcquisitions.length,
    averageAcquisitionCost.length,
    acquisitionCost.length,
    btcHoldings.length
  );

  for (let i = 0; i < minLength; i++) {
    tableData.push({
      date: dates[i] || "",
      btcAcquisitions: btcAcquisitions[i] || 0,
      averageAcquisitionCost: averageAcquisitionCost[i] || 0,
      acquisitionCost: acquisitionCost[i] || 0,
      btcHoldings: btcHoldings[i] || 0,
    });
  }

  return tableData;
}

function formatTableNumber(value, formatConfig) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const currentLocale = LanguageManager.currentLanguage;

  if (!formatConfig) {
    formatConfig = {
      decimals: 2,
      locale: currentLocale,
    };
  }

  if (!formatConfig.locale) {
    formatConfig.locale = currentLocale;
  }

  let numValue = value;

  if (typeof value === "string") {
    numValue = value.replace(/[R$\s₿]/g, "");
    numValue = numValue.replace(/\./g, "").replace(/,/g, ".");
    numValue = parseFloat(numValue);
  }

  if (isNaN(numValue)) {
    return value;
  }

  const formatted = numValue.toLocaleString(formatConfig.locale, {
    minimumFractionDigits: formatConfig.decimals || 2,
    maximumFractionDigits: formatConfig.decimals || 2,
  });

  return (formatConfig.prefix || "") + formatted;
}

async function loadTableData() {
  const config = chartsConfig.dataTable;

  if (!config) {
    return;
  }

  try {
    const data = await loadCSVFromURL(CHART_CONFIG.BASE_SHEET_URL + config.gid);

    if (data && data.columnData) {
      chartData.dataTable = data.columnData;
      createDataTable();
    }
  } catch (error) {}
}

const ChartsAPI = {
  updateChartConfig(chartId, newConfig) {
    if (chartsConfig[chartId]) {
      chartsConfig[chartId] = {
        ...chartsConfig[chartId],
        ...newConfig,
      };
      createChart(chartId);
    }
  },

  changeChartColor(chartId, color) {
    this.updateChartConfig(chartId, {
      style: {
        ...(chartsConfig[chartId] ? chartsConfig[chartId].style : {}),
        color,
      },
    });
  },

  configureChart5PurchasePoints(style) {
    this.updateChartConfig("chart5", {
      purchaseStyle: {
        ...chartsConfig.chart5.purchaseStyle,
        ...style,
      },
    });
  },

  updateAllValues() {
    updateCurrentValues();
    updateSimpleCurrentValues();
  },

  updateLanguage() {
    LanguageManager.detectCurrentLanguage();
    applyLocaleConfigurations();
    this.updateAllValues();

    Object.keys(chartInstances).forEach((chartKey) => {
      const chart = chartInstances[chartKey];
      if (chart && !chart.isDisposed()) {
        createChart(chartKey);
      }
    });

    if (chartData.dataTable) {
      createDataTable();
    }
  },

  updateTableData() {
    createDataTable();
  },

  reloadTableData() {
    loadTableData();
  },

  setChartYAxisMin(chartId, minValue) {
    if (chartsConfig[chartId]) {
      chartsConfig[chartId].yAxis = {
        ...chartsConfig[chartId].yAxis,
        min: minValue,
      };
      createChart(chartId);
    }
  },

  configureYAxis(chartId, yAxisOptions) {
    if (chartsConfig[chartId]) {
      chartsConfig[chartId].yAxisOptions = yAxisOptions;
      createChart(chartId);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  LanguageManager.init();

  applyLocaleConfigurations();

  isDarkMode = detectCurrentTheme();

  ChartContainerManager.init();

  loadAllData();
  setupThemeObserver();
});
