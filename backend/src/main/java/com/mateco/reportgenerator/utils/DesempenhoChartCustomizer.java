package com.mateco.reportgenerator.utils;

import net.sf.jasperreports.engine.JRChart;
import net.sf.jasperreports.engine.JRChartCustomizer;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.labels.ItemLabelAnchor;
import org.jfree.chart.labels.ItemLabelPosition;
import org.jfree.chart.labels.StandardCategoryItemLabelGenerator;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.chart.renderer.category.StandardBarPainter;
import org.jfree.ui.TextAnchor;

import java.awt.*;
import java.text.NumberFormat;

public class DesempenhoChartCustomizer implements JRChartCustomizer {

    @Override
    public void customize(JFreeChart chart, JRChart jasperChart) {
        CategoryPlot plot = chart.getCategoryPlot();
        int quantidadeBarras = plot.getDataset().getColumnCount();

        plot.setBackgroundPaint(Color.WHITE);
        plot.setOutlineVisible(false);
        plot.setRangeGridlinesVisible(false);
        plot.setDomainGridlinesVisible(false);

        // Escala perfeita (Max 45 questões + folga)
        NumberAxis yAxis = (NumberAxis) plot.getRangeAxis();
        yAxis.setVisible(false);
        yAxis.setRange(0, 55);

        CategoryAxis xAxis = plot.getDomainAxis();
        xAxis.setAxisLinePaint(Color.decode("#D0D0D0"));
        xAxis.setAxisLineStroke(new BasicStroke(1.5f));
        xAxis.setTickMarksVisible(false);
        xAxis.setTickLabelPaint(Color.BLACK);

        xAxis.setLowerMargin(0.05);
        xAxis.setUpperMargin(0.05);
        xAxis.setMaximumCategoryLabelWidthRatio(3.0f);
        xAxis.setMaximumCategoryLabelLines(1);

        BarRenderer renderer = (BarRenderer) plot.getRenderer();
        renderer.setBarPainter(new StandardBarPainter());
        renderer.setShadowVisible(false);
        renderer.setSeriesPaint(0, Color.decode("#409ab2"));

        // Bordas pretas idênticas à imagem de referência
        renderer.setDrawBarOutline(true);
        renderer.setSeriesOutlinePaint(0, Color.BLACK);
        renderer.setSeriesOutlineStroke(0, new BasicStroke(1.0f));

        // ==========================================
        // LÓGICA DE ESPAÇAMENTO E LARGURA RESPONSIVA
        // ==========================================
        if (quantidadeBarras > 15) {
            // Modo "Esmagado" (Ex: 22 simulados)
            xAxis.setTickLabelFont(new Font("SansSerif", Font.PLAIN, 6));
            xAxis.setCategoryMargin(0.10);
            renderer.setMaximumBarWidth(0.03);
        } else if (quantidadeBarras > 7) {
            // Modo Médio
            xAxis.setTickLabelFont(new Font("SansSerif", Font.PLAIN, 7));
            xAxis.setCategoryMargin(0.20);
            renderer.setMaximumBarWidth(0.05);
        } else {
            // Modo Premium (O distanciamento perfeito que você criou!)
            xAxis.setTickLabelFont(new Font("SansSerif", Font.PLAIN, 8));
            xAxis.setCategoryMargin(0.50); // 50% de espaço em branco
            renderer.setMaximumBarWidth(0.08); // Barras elegantes
        }

        // Números (Notas)
        renderer.setSeriesItemLabelGenerator(0, new StandardCategoryItemLabelGenerator("{2}", NumberFormat.getIntegerInstance()));
        renderer.setSeriesItemLabelsVisible(0, true);
        renderer.setSeriesItemLabelPaint(0, Color.BLACK);

        int tamanhoFonteNumero = (quantidadeBarras > 10) ? 8 : 10;
        renderer.setSeriesItemLabelFont(0, new Font("SansSerif", Font.PLAIN, tamanhoFonteNumero));

        ItemLabelPosition position = new ItemLabelPosition(
                ItemLabelAnchor.OUTSIDE12,
                TextAnchor.BOTTOM_CENTER,
                TextAnchor.BOTTOM_CENTER,
                0.0
        );
        renderer.setSeriesPositiveItemLabelPosition(0, position);

        double offset = (quantidadeBarras > 10) ? 2.0 : 5.0;
        renderer.setItemLabelAnchorOffset(offset);
    }
}