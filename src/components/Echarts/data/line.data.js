export default function lineData(report, data) {
  const length = data.cols.length === 0 ? 0 : data.cols.length - 1;
  const series = Array(length).fill({
    type: "line",
    label: {
      show: false,
      position: "top",
      color: "auto"
    }
  });

  return {
    dataset: {
      dimensions: data.cols.map(c => c.key),
      source: data.rows.map(r => r.cols)
    },
    series
  };
}
