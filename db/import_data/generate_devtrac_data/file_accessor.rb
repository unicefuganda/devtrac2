class FileAccessor
    def read_file file_name, get_header
        lines = CSV.read(file_name)

        puts "Read main file #{file_name} (#{lines.size} lines)"

        if get_header
            @header = remove_header lines
            @header[@header.size - 2] = 'DISTRICT'
            @header.concat ['LAT', 'LONG']
        end

        lines
    end

    def clean_bad_bytes file_name
        clean_lines = []

        File.open(file_name, 'r') do |infile|
            while (line = infile.gets)
                clean_lines << clean_line(line)
            end
        end

        clean_lines
    end

    def clean_line line
        ic = Iconv.new('UTF-8//IGNORE', 'UTF-8')

        ic.iconv(line + ' ')[0..-2]
    end

    def write_new_file file_name, lines
        counter = 0
        file_name = add_new_to_file_name(file_name)

        File.open(file_name, "w") do |file|
            file.puts @header.join(',') if @header
            counter += 1
            lines.each do |line|
                if line.size > 1
                    counter += 1
                    file.puts "\"" + line.join("\",\"") + "\""
                end
            end
        end

        puts "Wrote main file as #{file_name} (#{counter} lines)"
    end

    def add_new_to_file_name file_name
        file_pieces = file_name.split('.')
        if file_pieces.size !=2
            raise 'File name should have only single extension'
        else
            file_pieces[0] + "_new." + file_pieces[1]
        end
    end

  private
    def remove_header lines
      lines.shift
    end
end
