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
import org.jfree.chart.renderer.category.LineAndShapeRenderer;
import org.jfree.ui.TextAnchor;

import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.text.NumberFormat;

public class IpmChartCustomizer implements JRChartCustomizer {

    @Override
    public void customize(JFreeChart chart, JRChart jasperChart) {
        CategoryPlot plot = chart.getCategoryPlot();
        int quantidadePontos = plot.getDataset().getColumnCount();

        plot.setBackgroundPaint(Color.WHITE);
        plot.setOutlineVisible(false);
        plot.setRangeGridlinesVisible(false);
        plot.setDomainGridlinesVisible(false);

        NumberAxis yAxis = (NumberAxis) plot.getRangeAxis();
        yAxis.setVisible(false);
        yAxis.setRange(0, 130);
        yAxis.setUpperMargin(0.0);

        CategoryAxis xAxis = plot.getDomainAxis();
        xAxis.setAxisLinePaint(Color.decode("#D0D0D0"));
        xAxis.setAxisLineStroke(new BasicStroke(1.5f));
        xAxis.setTickMarksVisible(false);
        xAxis.setTickLabelPaint(Color.BLACK);

        // ==========================================
        // ESPELHAMENTO DO EIXO X (IDÊNTICO ÀS BARRAS)
        // ==========================================
        if (quantidadePontos > 15) {
            xAxis.setTickLabelFont(new Font("SansSerif", Font.PLAIN, 6));
            xAxis.setCategoryMargin(0.10);
        } else if (quantidadePontos > 7) {
            xAxis.setTickLabelFont(new Font("SansSerif", Font.PLAIN, 7));
            xAxis.setCategoryMargin(0.20);
        } else {
            xAxis.setTickLabelFont(new Font("SansSerif", Font.PLAIN, 8));
            xAxis.setCategoryMargin(0.50); // O mesmo distanciamento das barras!
        }

        xAxis.setLowerMargin(0.05); // Mesma margem do gráfico de barras
        xAxis.setUpperMargin(0.05); // Mesma margem do gráfico de barras
        xAxis.setMaximumCategoryLabelWidthRatio(3.0f);
        xAxis.setMaximumCategoryLabelLines(1);

        LineAndShapeRenderer renderer = (LineAndShapeRenderer) plot.getRenderer();

        double tamanhoBolinha = (quantidadePontos > 15) ? 3.0 : 5.0;
        double raio = tamanhoBolinha / 2.0;
        renderer.setSeriesShape(0, new Ellipse2D.Double(-raio, -raio, tamanhoBolinha, tamanhoBolinha));

        Color corMateco = Color.decode("#db3b2b");
        renderer.setSeriesPaint(0, corMateco);
        renderer.setSeriesStroke(0, new BasicStroke(1.5f));
        renderer.setUseFillPaint(true);
        renderer.setSeriesFillPaint(0, corMateco);

        // ==========================================
        // NÚMEROS (LABELS) CORRIGIDO
        // ==========================================
        renderer.setSeriesItemLabelGenerator(0, new StandardCategoryItemLabelGenerator("{2}", NumberFormat.getIntegerInstance()));
        renderer.setSeriesItemLabelsVisible(0, true);
        renderer.setSeriesItemLabelPaint(0, Color.BLACK);

        int tamanhoFonteLabel = (quantidadePontos > 10) ? 8 : 10;
        renderer.setSeriesItemLabelFont(0, new Font("SansSerif", Font.PLAIN, tamanhoFonteLabel));

        // Construtor real de 4 parâmetros (trava a rotação em 0.0)
        ItemLabelPosition position = new ItemLabelPosition(
                ItemLabelAnchor.OUTSIDE12,
                TextAnchor.BOTTOM_CENTER,
                TextAnchor.BOTTOM_CENTER,
                0.0
        );

        renderer.setSeriesPositiveItemLabelPosition(0, position);

        // A FORMA CORRETA DE AFASTAR O NÚMERO:
        // Isso empurra o número 10 pixels para cima, descolando da bolinha vermelha
        renderer.setItemLabelAnchorOffset(10.0);

        renderer.setBaseItemLabelsVisible(true);
    }
}